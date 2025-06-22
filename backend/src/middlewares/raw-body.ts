export default () => {
    return async (ctx, next) => {
        if (
            ctx.request.url.startsWith('/api/orders/webhook') &&
            ctx.request.method === 'POST'
        ) {
            const rawBody = await new Promise<Buffer>((resolve, reject) => {
                let data: any[] = [];
                ctx.req
                .on('data', (chunk) => data.push(chunk))
                .on('end', () => resolve(Buffer.concat(data)))
                .on('error', reject);
            });

            ctx.request.body = rawBody;
            ctx.request.rawBody = rawBody;
        }

        return next();
    };
};
