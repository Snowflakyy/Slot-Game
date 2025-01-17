# Slot-Game 🎰
### run npx tsc to create the dist folder
### run node/dist/backend/server.js
### server listens on port 4000 and accept requests from http://localhost:4000/run-slot

- post request requires json:
-  ```typescript
    {
    "balance":10000
   }
- response is the total amount of win on coin Out
-   ```typescript
    {
    "totalBalance": 12950
    }
- simulation lasts for 10 spins with different execution speed
- every temporary result is logged after each given spin

## Logged data:
- each screen (e.g)
- ```typescript
  [ [ 4, 1, 9, 3, 1 ], [ 3, 1, 9, 1, 8 ], [ 3, 8, 2, 1, 8 ] ]
- payouts for each line
- ```typescript
  [
  { line: [ 0, 0, 0, 0, 0 ], winningReels: [ [Object] ], win: 0 },
  { line: [ 1, 1, 1, 1, 1 ], winningReels: [ [Object] ], win: 0 },
  { line: [ 2, 2, 2, 2, 2 ], winningReels: [ [Object] ], win: 0 },
  {
    line: [ 0, 1, 0, 1, 0 ],
    winningReels: [ [Object], [Object] ],
    win: 150
  },
  { line: [ 1, 2, 1, 2, 1 ], winningReels: [ [Object] ], win: 0 }
  ]
