import { expect, test } from "@playwright/test";
import { io } from "socket.io-client";

const MANAGER_PASSWORD = process.env.MANAGER_PASSWORD || "P@ssw0rd"; // Default from old script
const SERVER_URL = "http://localhost:3001";
const BROWSER_PLAYER_COUNT = 200; // Number of players running in real browser tabs
const SOCKET_PLAYER_COUNT = 0; // Number of socket-only players

test("Load Test: Manager + Hybrid Players", async ({ browser }) => {
  // Extended timeout for load test
  test.setTimeout(10 * 60 * 1000);

  console.log("--- Starting Hybrid Load Test ---");

  // --- Manager Setup ---
  const managerContext = await browser.newContext();
  const managerPage = await managerContext.newPage();

  console.log("Manager: Logging in...");
  await managerPage.goto("/manager/login");
  await managerPage.fill('input[type="password"]', MANAGER_PASSWORD);
  await managerPage.click('button[type="submit"]');
  await expect(managerPage).toHaveURL(/.*\/manager/);
  console.log("Manager: Logged in.");

  console.log("Manager: Creating Game...");
  // Assuming the first quiz has a "Start" button.
  await managerPage.locator('button:has-text("Start")').first().click();

  // Wait for Room and Get PIN
  await expect(managerPage).toHaveURL(/.*\/game\/manager\/.*/);

  // Reveal PIN
  await managerPage.locator(".cursor-pointer").first().click();

  const pinLocator = managerPage.locator(".text-6xl.font-extrabold");
  await expect(pinLocator).toBeVisible();
  const inviteCode = await pinLocator.innerText();
  console.log(`Game PIN retrieved: ${inviteCode}`);

  // --- Player Setup ---
  console.log(
    `Spawning ${BROWSER_PLAYER_COUNT} Browser Players and ${SOCKET_PLAYER_COUNT} Socket Players...`
  );

  // 1. Start Socket Players
  const socketPlayersPromise = startSocketPlayers(
    inviteCode,
    SOCKET_PLAYER_COUNT
  );

  // 2. Start Browser Players
  const browserPlayers: Promise<void>[] = [];
  for (let i = 0; i < BROWSER_PLAYER_COUNT; i++) {
    browserPlayers.push(
      runBrowserPlayer(browser, inviteCode, `WebPlayer_${i}`)
    );
  }

  // Wait for all players to join (Sockets are fast, Browsers take time)
  // We can just wait for the Manager to see them, or rely on internal promises.
  // Ideally, we wait for socket players to finish joining.
  await socketPlayersPromise;
  console.log("Socket players connected.");

  // Give browser players a moment to finish joining
  await managerPage.waitForTimeout(5000);

  // --- Start Game ---
  console.log("Manager: Starting Game...");
  const startButton = managerPage.locator('button:has-text("Start Game")');
  await startButton.click();

  // --- Game Loop ---
  // The Manager drives the game.
  // Browser Players automatically answer when they see questions.

  let gameFinished = false;
  let round = 1;

  while (!gameFinished) {
    try {
      await managerPage.waitForTimeout(2000);

      // Check for "Next" button (End of question / Leaderboard)
      const nextButton = managerPage.locator('button:has-text("Next")');
      if (await nextButton.isVisible()) {
        console.log(`Manager: Clicking Next (Round ${round})...`);
        await nextButton.click();
        round++;
        continue;
      }

      // Check for Podium (Game End)
      // If we see the podium, we are done.
      // We can check for specific podium elements or just "Game Finished" text if added.
      // Assuming if "Next" is gone for a long time and we are at the end.

      // Let's rely on a timeout-based break or URL change if possible?
      // Or check if the manager socket (if we had access) says finished.
      // For now, let's look for a generic "Play Again" or "Home" button that might appear on Podium?
      // Or just run for a reasonable time/rounds.

      // If we want to be robust, we can check for "Results" or similar text.
    } catch (e) {
      console.error("Error in game loop", e);
    }

    // Safety break for testing
    if (round > 20) break;
  }

  // Cleanup
  await managerContext.close();
});

// --- Helper Functions ---

async function runBrowserPlayer(browser: any, pin: string, username: string) {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Join Room
    await page.goto(`/?pin=${pin}`); // Direct link if supported, or manually enter
    // If query param works, great. If not, we type it.
    // The Room.tsx component checks 'pin' prop but URL param handling is in page.tsx: <Room pin={searchParams.get("pin") ... />
    // So /?pin=PIN should pre-fill or auto-join?
    // Room.tsx useEffect: if (pin) socket.emit('player:join', pin)
    // So it should auto-join!

    // Wait for "Player Name" input (PlayerProfile)
    // If auto-join works, we land on PlayerProfile.
    await expect(
      page.locator('input[placeholder="Your name here"]')
    ).toBeVisible({ timeout: 10000 });

    // 2. Profile Setup
    await page.fill('input[placeholder="Your name here"]', username);
    await page.click('button:has-text("I\'m ready!")');

    // 3. Wait for Game
    await expect(page.locator("text=Waiting for the players")).toBeVisible();
    console.log(`Browser Player ${username}: Joined and Waiting.`);

    // 4. Game Loop (Answer questions)
    // We loop and look for answer buttons.
    while (true) {
      try {
        // Wait for answers to appear
        // Answers.tsx buttons usually don't have text "Answer" specifically, but we can look for the container.
        // Or look for 4 buttons in a grid.
        // Icons: Triangle, Rhombus, Circle, Square.
        // Let's just look for any button inside the answer grid.
        const answerButtons = page.locator("div.grid.grid-cols-2 button");

        if (await answerButtons.first().isVisible()) {
          // Pick a random one
          const count = await answerButtons.count();
          if (count > 0) {
            const idx = Math.floor(Math.random() * count);
            await answerButtons.nth(idx).click();
            console.log(`Browser Player ${username}: Answered!`);

            // Wait for result/next question (buttons disappear or change state)
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
        // Ignore timeouts, just keep loop
        // If page closes, break
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
      // Use a small delay to prevent slamming the server instantly
      setTimeout(() => {
        const socket = io(SERVER_URL, {
          auth: { clientId: `socket-player-${i}` },
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
              username: `SocketP_${i}`,
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

        // Simple AI to answer questions
        socket.on("game:status", (status: any) => {
          if (status.name === "SELECT_ANSWER" && myGameId) {
            const answers = status.data.answers || [];
            const answerKey = Math.floor(Math.random() * answers.length);
            const delay = Math.random() * 2000 + 500;

            setTimeout(() => {
              socket.emit("player:selectedAnswer", {
                gameId: myGameId,
                data: { answerKey },
              });
            }, delay);
          }
        });
      }, i * 20); // 20ms stagger
    }
  });
}
