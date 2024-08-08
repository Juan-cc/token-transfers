type TransferLog = {
    from: `0x${string}` | undefined,
    to: `0x${string}` | undefined,
    value: string | undefined,
    block: string,
    key: string,
    tx: `0x${string}`
}

export { TransferLog }