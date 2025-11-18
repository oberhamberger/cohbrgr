import { Response } from 'express';
import { etagOf } from 'src/utils/common';

export const sendJsonWithEtag = (response: Response, payload: unknown) => {
    const tag = etagOf(payload);
    response.set('ETag', tag);
    if (response.req.headers['if-none-match'] === tag) {
        return response.status(304).end();
    }
    return response.json(payload);
};
