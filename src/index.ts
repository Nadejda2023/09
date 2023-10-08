import { runDB } from "./db/db";
import * as dotenv from 'dotenv';
dotenv.config()


import { app } from "./setting";





const port = process.env.PORT || 3338


const startApp = async () => {
  await runDB()
  
  app.listen(port, () => {
  console.log(`Listen ${port}`)
})
}
startApp()





