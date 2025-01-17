import { Slot } from "./dataStructures"
import data from "./exampleData/data"

export const simulateScript =async (numberOfSpins:number,balance:number)=>{
    const fiveReelSlot = new Slot(data,balance)
    for(let i=0;i<numberOfSpins;i++){
        const delay = Math.floor(Math.random()*1000)+500;

        //different execution speed
        await new Promise((resolve)=>setTimeout(resolve,delay)) 

        const {screen,payouts,totalPayout}=fiveReelSlot.spin(5);
        console.log(`Spin ${i+1}:`)
        console.log("Screen is: ",screen)
        console.log("Current payouts are: ",payouts);
        console.log("Total payout is: ",totalPayout);
    }
    //information about the total win is returned as a response from the post request 
    return fiveReelSlot.coinOut
}