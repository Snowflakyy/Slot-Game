interface SlotProps {
  reelsCount: number;
  rowsCount: number;
  symbols: Record<number, number[]>;
  lines: number[][];
  reels: number[][];
}
export class Slot implements SlotProps {
  reelsCount: number;
  rowsCount: number;
  symbols: Record<number, number[]>;
  lines: number[][];
  reels: number[][];
  #coinOut: number;
  constructor(
    { reelsCount, rowsCount, symbols, lines, reels }: SlotProps,
    maxCredits: number
  ) {
    this.reelsCount = reelsCount;
    this.rowsCount = rowsCount;
    this.symbols = symbols;
    this.lines = lines;
    this.reels = reels;
    this.#coinOut = maxCredits;
  }
  get coinOut(): number {
    return this.#coinOut;
  }
  set coinOut(bet: number) {
    this.#coinOut -= bet;
  }
  /**
   * 
   * @param reels  Array of reels containing symbols
   * @param rowsCount 
   * @returns  A matrix [reelCount][rowsCount]
   */
  private spinReels(reels: number[][], rowsCount: number): number[][] {
    const screen: number[][] = [];
    for (const reel of reels) {
      const currentReel: number[] = [];
      const randomSymbol = Math.floor(Math.random() * reel.length);
      for (let i = 0; i < rowsCount; i++) {
        currentReel.push(reel[(randomSymbol + i) % reel.length]);
      }
      screen.push(currentReel);
    }
    return screen;
  }

  /**
   * 
   * @param screen 
   * @param line  winning payline
   * @returns  An object containing the count of the lined-up symbol and the symbol itself 
   */
  private checkPayLines(
    screen: number[][],
    line: number[]
  ): Record<string, number> {
    const lineSymbols = line.map(
      (reelPosition, index) => screen[index][reelPosition]
    );
    const firstSymbol = lineSymbols[0];
    let totalCount = 1;
    for (let i = 1; i < lineSymbols.length; i++) {
      if (lineSymbols[i] !== firstSymbol) {
        break;
      }
      totalCount++;
    }
    const payoutArray = Array(totalCount).fill(firstSymbol);
    return { symbol: firstSymbol, count: totalCount };
  }

  /**
   * 
   * @param symbols  An Array which contains the amount of win with respect to the count
   * @param symbol 
   * @param count 
   * @param bet  the bet of the player
   * @returns the win for the current line, if error - defaults to 0;
   */
  private estimateWin(
    symbols: Record<number, number[]>,
    symbol: number,
    count: number,
    bet: number
  ) {
    //possible error with string
    const symbolValues = symbols[symbol];
    if (!symbolValues || count >= symbolValues.length) {
      console.error("There is a mismatch in the slot data");
      return 0;
    }
    const win = symbolValues[count] * bet
    this.#coinOut += win;
    return win;
  }

  /**
   * 
   * @param screen 
   * @returns Transponed matrix of the screen to better visualize the Slot
   */
  private reverseScreen(screen: number[][]) {
    const transposed: number[][] = [];
    for (let i = 0; i < screen[0].length; i++) {
      const newRow: number[] = [];
      for (let j = 0; j < screen.length; j++) {
        newRow.push(screen[j][i]);
      }
      transposed.push(newRow);
    }
    return transposed;
  }

  /**
   * 
   * @param line 
   * @param count 
   * @param symbol 
   * @returns An Array of the winning reels(objects), each object contains the x,y,symbol,
   *  length of the array is based on the count
   */
  private getLineCoordinates(line:number[], count:number,symbol:number):{x:number,y:number,symbol:number}[]{
    return line.map((rowIndex,colIndex)=>{
        if(colIndex<count){
            return{
                x:colIndex,
                y:rowIndex,
                symbol:symbol
            }
        };
        return null;
       }).filter((item)=> item !==null)
       

  }

  spin(bet: number) {
    this.coinOut = bet;
    const previousCoin = this.coinOut;

    const screen = this.spinReels(this.reels, this.rowsCount);

    const payouts: {
      line: number[];
      winningReels: {x:number,y:number;symbol:number}[];
      win: number;
    }[] = [];

    for (const line of this.lines) {
      const { symbol, count } = this.checkPayLines(screen, line);
      const symbolValues = this.symbols[symbol];
      const win = this.estimateWin(this.symbols, symbol, count, bet) ?? 0 ;
      const winningReels = this.getLineCoordinates(line,count,symbol)
      payouts.push({
        line,
        winningReels,
        win,
      });
    }
    const transposedScreen = this.reverseScreen(screen);
    return { screen: transposedScreen,payouts:payouts, totalPayout: this.coinOut - previousCoin };
  }
}
