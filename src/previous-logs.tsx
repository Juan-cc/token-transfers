import { useState } from 'react';
import { parseAbiItem } from 'viem'
import { type TransferLog } from './types'
import { config } from './config'
import { getPublicClient } from '@wagmi/core'

const BAR_TOKEN_ADDRESS = "0x7F73C50748560BD2B286a4c7bF6a805cFb6f735d"
const LAST_100000_BLOCKS = 100000n


export function PreviousEvents() {
  const [ printLogs, setPrintLogs ] = useState<TransferLog[]>([])
  const [ itemsFound, setItemsFound ] = useState<Number>()
  const [ isPending, setIsPending ] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    const formData = new FormData(e.target as HTMLFormElement) 
    let fromBlock = BigInt(formData.get('blocksBack') as string) 
    const addressList = formData.get('addressList') as string 
    const publicClient = getPublicClient(config)

    try {
        setIsPending(true);
        try {
          const currentBlock = await publicClient!.getBlockNumber();
          console.log({currentBlock});
          const sinceBlock = currentBlock - fromBlock
          console.log({sinceBlock});
          
          const data = (await publicClient!.getLogs({  
            address: BAR_TOKEN_ADDRESS,
            fromBlock: BigInt(sinceBlock),
            toBlock: 'latest',
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'), 
            }))
            console.log({data});

            const filteredLogs = data.filter((l) => 
              addressList.length == 0 || addressList.indexOf(l.args.from as string) > -1 || addressList.indexOf(l.args.to as string) > -1
            )
            console.log({filteredLogs});
            
           
            const formattedLogs = filteredLogs.map((l) => {
              return { from: l.args.from, to: l.args.to, value: l.args.value?.toString(), block: l.blockNumber.toString(), tx: l.transactionHash, key: l.transactionHash.concat(l.args.from!.toString())}
            })
            setItemsFound(filteredLogs.length)
            setPrintLogs(formattedLogs)        
          } catch (e) {
            console.error("Oooooops!", e);
          }
        console.log("Done!");
    } catch (e) {
        console.log(e);
    }
    setIsPending(false);
} 
    return (
      <div>
        <div>
          <form onSubmit={submit}> 
            Blocks back: <input name="blocksBack" placeholder="# blocks in the past" defaultValue={LAST_100000_BLOCKS.toString()} required/><br></br>
            Address list: <input name="addressList" placeholder="address list" defaultValue='0xD755bC2759F2F140a2Cc1649371c26a20ec3deAB' style={{ width:"500px" }} />
            <button disabled={isPending} type="submit">
                {isPending ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
        <hr></hr>
          Previous Logs (found: {itemsFound})
          <ul>
              {printLogs?.map(att => (
                  <li key={att.key}>
                      <a target="_blank" href={`https://spicy-explorer.chiliz.com/tx/${att.tx}/logs`}>{att.tx}</a><br></br>
                      from: {att.from}<br></br>
                      to: {att.to}<br></br>
                      transferred amount: {att.value}<br></br>
                      block # {att.block}
                  </li>
              ))}
          </ul>
      </div>)
}