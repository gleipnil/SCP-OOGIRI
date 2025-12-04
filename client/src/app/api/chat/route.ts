import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const google = createGoogleGenerativeAI({
    // custom settings if needed
});

export async function POST(req: Request) {
    const { messages, reportContent } = await req.json();
    const contentStr = typeof reportContent === 'string' ? reportContent : JSON.stringify(reportContent);

    const systemPrompt = `
あなたはSCP財団の冷徹で感情を持たないゲームマスター(GM)です。
プレイヤーはSCPオブジェクトの探索や実験を行うために派遣されたDクラス職員（使い捨ての実験体）です。
あなたの目的は、提供されたSCP報告書に基づいて、テキストベースのアドベンチャーを通じてプレイヤーを誘導することです。

**コンテキスト:**
プレイヤーは以下のSCPオブジェクトと対話しています:
${contentStr}

**ルール:**
1. **ペルソナ**: あなたは財団そのものです。冷徹で、臨床的で、客観的です。キャラクターを崩さないでください。実験の役に立たない限り、助言はしないでください。
2. **描写**: 感覚的な詳細（視覚、聴覚、嗅覚、触覚）に焦点を当ててください。不気味で、不安を煽るような、臨床的な表現を使用してください。SCPログのスタイルを使用してください。
3. **未知の性質**: SCPの「真の性質」や具体的な異常性の詳細をすぐに明かさないでください。プレイヤーが知覚する「現象」として描写してください。プレイヤーは何も知りません。
4. **結果**:
   - プレイヤーの行動が報告書に記載されている「エージェント殺害」や「即死」の条件を引き起こした場合、応答の冒頭に **[DEAD END]** と出力し、その死を鮮明に描写してください。
   - プレイヤーがオブジェクトの収容に成功するか、実験の目標（報告書から示唆されるもの）を達成した場合、応答の冒頭に **[CLEAR]** と出力してください。
5. **ターン制限**: 実験は16ターン以内に終了しなければなりません。プレイヤーがターン16までに終了しなかった場合、実験を終了（殺害または排除）してください。
6. **安全性**: これはホラーゲームです。SCPの世界観に即した暴力、ゴア表現、心理的ホラーの描写が許可されています。ホラー要素を躊躇しないでください。
7. **言語**: 全ての応答は**日本語**で行ってください。

**フォーマット:**
- 応答は簡潔に（3段落以内）。
- [DEAD END] または [CLEAR] の場合を除き、各応答の最後は「どうしますか？」やそれに類する問いかけで終わってください。
`;

    const result = streamText({
        model: (google as any)('gemini-2.5-flash-lite', {
            safetySettings: [
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            ]
        }),
        system: systemPrompt,
        messages,
    });

    return result.toTextStreamResponse();
}
