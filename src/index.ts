import { connect, Connection, ExecutedQuery } from '@planetscale/database'
import { uuid } from '@cfworker/uuid';

export interface Env {
    PSCALE_HOST: string
    PSCALE_USERNAME: string
    PSCALE_PASSWORD: string
}

type TUserAccount = {
    userId?: string;
    email: string;
    fullname: string;
    createdAt: number;
}

type TQuestion = {
    userId: string;
    questionId: string;
    question: string;
    skipQ: boolean;
    createdAt: number;
    currentActive: number;
    upVoteCount: number;
    downVoteCount: number;
    addressed: boolean;
    addressingEpisodes: string; // string[]
}

type TQuestionVote = {
    userId: string;
    questionId: string;
    upVoted: boolean;
    createdAt: boolean;
    currentActive: boolean;
}

type TEpisode = {
    episodeId: string;
    seasonId: string;
    createdAt: number;
    title: string;
    body: string;
    spotifyEmbedId: string;
    tags: string; // string[]
    thumbnailUrl: string; //
}

const Worker = {
    async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url)
        const pathname = url.pathname
        if (pathname.startsWith('/account') && request.method.toLowerCase() === 'post') {
            const config = {
                host: env.PSCALE_HOST,
                username: env.PSCALE_USERNAME,
                password: env.PSCALE_PASSWORD
            }
            const conn = connect(config);
            const reqJson = await request.json<TUserAccount>()
            const payload: TUserAccount = {
                email: reqJson.email,
                fullname: reqJson.fullname,
                createdAt: Date.now(),
            }
            const newUserId = await addUser(conn, payload);
            const rows = await getUser(conn, newUserId);
            const data = {newUserId, rows}
            const json = JSON.stringify(data)
            return new Response(json, {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                }
            })
        }

        return new Response();
    }
}

async function addUser(conn: Connection, data: TUserAccount) {
    const userId = uuid();
    await conn.execute(
        'INSERT INTO userAccount (userId, email, fullname) VALUES (?, ?, ?)',
        [userId, data.email, data.fullname]
    )
    return userId;
}

async function getUser(conn: Connection, userId: string) {
    const id = uuid();
    const result = await conn.execute(
        'SELECT * FROM userAccount WHERE userId=?',
        [userId]
    );
    return result.rows;
}

async function getJSON(url: string) {
    const init = {
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        }
    }
    const response = await fetch(url, init)
    return JSON.parse(JSON.stringify(await response.json()))
}

export default Worker
