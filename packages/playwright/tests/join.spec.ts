import { expect, test } from "@playwright/test";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";
const BROWSER_PLAYER_COUNT = 5; // Number of players running in real browser tabs
const SOCKET_PLAYER_COUNT = 195; // Number of socket-only players

// Read PIN from environment variable
const GAME_PIN = process.env.GAME_PIN;

test("Join Game: Hybrid Players", async ({ browser }) => {
  if (!GAME_PIN) {
    console.error("Error: GAME_PIN environment variable is required.");
    console.error("Usage: GAME_PIN=123456 pnpm test:join");
    // Fail the test if no PIN provided
    expect(GAME_PIN).toBeDefined();
    return;
  }

  // Extended timeout for manual play
  test.setTimeout(30 * 60 * 1000);

  console.log(`--- Starting Join-Only Test for PIN: ${GAME_PIN} ---`);
  console.log(
    `Spawning ${BROWSER_PLAYER_COUNT} Browser Players and ${SOCKET_PLAYER_COUNT} Socket Players...`
  );

  // 1. Start Socket Players
  const socketPlayersPromise = startSocketPlayers(
    GAME_PIN,
    SOCKET_PLAYER_COUNT
  );

  // 2. Start Browser Players
  const browserPlayers: Promise<void>[] = [];
  for (let i = 0; i < BROWSER_PLAYER_COUNT; i++) {
    browserPlayers.push(runBrowserPlayer(browser, GAME_PIN, `WebPlayer_${i}`));
  }

  // Wait for socket players to connect
  await socketPlayersPromise;
  console.log("Socket players connected.");

  console.log("All players spawned. Waiting for game to proceed...");

  // Keep the test running to allow browser players to interact
  // We wait for all browser player promises to resolve (which happens when game finishes or error)
  await Promise.all(browserPlayers);
});

// --- Helper Functions (Duplicated/Shared from load.spec.ts) ---
// In a real project, extract these to a helper file.

async function runBrowserPlayer(browser: any, pin: string, username: string) {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Join Room
    await page.goto(`/?pin=${pin}`);

    // Wait for "Player Name" input (PlayerProfile)
    // If invalid PIN, we might be stuck on Room.
    try {
      await expect(
        page.locator('input[placeholder="Your name here"]')
      ).toBeVisible({ timeout: 5000 });
    } catch {
      console.log(
        `Browser Player ${username}: Could not reach profile. Check PIN?`
      );
      // If we are still on join page, maybe PIN was invalid?
      // But let's assume valid PIN for now or manual entry required?
      // If query param didn't work, we try manual entry logic if needed,
      // but current app seems to handle ?pin=...
    }

    // 2. Profile Setup
    await page.fill('input[placeholder="Your name here"]', username);
    await page.click('button:has-text("I\'m ready!")');

    // 3. Wait for Game
    await expect(page.locator("text=Waiting for the players")).toBeVisible();
    console.log(`Browser Player ${username}: Joined and Waiting.`);

    // 4. Game Loop (Answer questions)
    while (true) {
      try {
        // Wait for answers to appear
        const answerButtons = page.locator("div.grid.grid-cols-2 button");

        if (await answerButtons.first().isVisible()) {
          const count = await answerButtons.count();
          if (count > 0) {
            const idx = Math.floor(Math.random() * count);
            const delay = Math.random() * 5000;
            // Use Playwright's waitForTimeout for better handling
            await page.waitForTimeout(delay);

            // Check if button is still visible
            if (await answerButtons.nth(idx).isVisible()) {
              await answerButtons.nth(idx).click();
              console.log(`Browser Player ${username}: Answered!`);
            }

            await expect(answerButtons.first()).toBeHidden({ timeout: 30000 });
          }
        }

        // Check for Game Finished
        if (await page.locator("text=Game Finished").isVisible()) {
          console.log(`Browser Player ${username}: Game Finished.`);
          break;
        }

        await page.waitForTimeout(1000);
      } catch (e) {
        if (page.isClosed()) break;
      }
    }
  } catch (e) {
    console.error(`Browser Player ${username} Error:`, e);
  } finally {
    await context.close();
  }
}

async function startSocketPlayers(inviteCode: string, count: number) {
  const sockets: any[] = [];

  return new Promise<void>((resolve) => {
    let joinedCount = 0;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const socket = io(SERVER_URL, {
          auth: { clientId: `socket-join-player-${i}` },
          transports: ["websocket"],
        });
        sockets.push(socket);

        let myGameId: string;

        socket.on("connect", () => {
          socket.emit("player:join", inviteCode);
        });

        socket.on("game:successRoom", (gid: string) => {
          myGameId = gid;
          socket.emit("player:login", {
            gameId: gid,
            data: {
              username: `SockP_${i}`,
              avatarId: Math.floor(Math.random() * 8),
            },
          });
        });

        socket.on("game:successJoin", () => {
          joinedCount++;
          if (joinedCount % 50 === 0)
            console.log(`Socket Players: ${joinedCount} joined...`);
          if (joinedCount === count) resolve();
        });

        socket.on("game:status", (status: any) => {
          if (status.name === "SELECT_ANSWER" && myGameId) {
            const answers = status.data.answers || [];
            const answerKey = Math.floor(Math.random() * answers.length);
            const delay = Math.random() * 5000;

            setTimeout(() => {
              socket.emit("player:selectedAnswer", {
                gameId: myGameId,
                data: { answerKey },
              });
            }, delay);
          }
        });
      }, i * 20);
    }
  });
}
