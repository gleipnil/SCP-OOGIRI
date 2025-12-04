"use client";

import { useState } from 'react';

// Define the interface to match the user's data structure
interface Report {
    id: string;
    title: string;
    content: any; // The user's data has content as an object
    author_ids: string[];
    created_at: string;
    is_hidden: boolean;
}

const MOCK_REPORTS: Report[] = [
    {
        "id": "d2a80ac8-ea79-4081-8eb7-f6b030f4d357",
        "title": "この星の肝臓",
        "content": {
            "conclusion": "このオブジェクトは、16世紀ごろポルトガルの貿易会社の社長の死後、コレクションの流出により発見されたと言われています。\n当時より、アルコール、タバコはもとより、銅や水銀に対しても反応があったことが伝えられており、その社長も、ピエロマスクの周辺にはそれらのものを遠ざけており、\n社長自身も117歳まで生きたという伝説があります。\n当オブジェクトに対する実験は全て禁止です。\nまた、過去の実験記録については削除済です。\n\n\n\n\n\n\n\n\n\n\n【セキュリティクリアランス 5以上のみ閲覧可】\n当オブジェクトの本質は、星系規模で適用される解毒作用です。\nこの星の生物、特に人間に対して、アルコールやニコチン、銅や水銀など、様々な物質に対しての解毒作用のほとんどは、\nこのオブジェクトに起因するものです。人体に備わっている肝細胞は、このオブジェクトとのゲートと言えます。\nこれまでの研究によって、肝臓経由でなくとも、周囲の空間の解毒処理も行っていることが明らかになっています。\n一方、このオブジェクトの解毒作用の限界が間近に迫っていることがわかっています。\n16世紀頃のこのマスクは赤色だったと伝えられているが、19世紀ごろには半分ほど白になっており、\n現在においてはマスクの目の縁周辺のみに赤みが残るのみになっています。\n財団は、このマスクの解毒作用を可能な限り残すことができるよう、封じ込め処理で解毒能力の肩代わりを行い、\n全世界的に煤煙排出の現象、健康増進支援などを行っていますが、具体的にどのくらいの歯止めになっているのかわかっていません。\n願わくば次の代まで、この文書が届きますよう。",
            "constraint": {
                "id": "constraint-0.4976772726464358",
                "hiddenDescription": "このSCPの脅威は、実は人類の特定の行動によって活性化・悪化するが、その行動は日常に溶け込んでいる。",
                "publicDescriptions": [
                    "Apollyon",
                    "物理的な存在",
                    "常に感知されるものがある",
                    "厳重な封じ込めが試みられている"
                ]
            },
            "descriptionLate": "",
            "descriptionEarly": "当SCPは、「正方形のプラチナ金属箱の中に封じ込められた状態のピエロのマスク」が本体と仮説されています。\n\n当SCPに対して高濃度の王水を注ぐことで、金属箱が完全に再生するのを防いでいます。\nまた、当SCPに対して意志のようなものを確認しており、ウィスキー、煙草の香りに強い反応を示しています。\n\n特に煙草の香りに関して強い関心を得ている様子が確認されており、金属箱の修復速度の活性化が見られています。\n金属箱が活性化した場合、周辺の生物に対して強い酩酊状態を与えることが確認されています。\n\nまた、当SCPの周囲で火のついたタバコが確認された際、周辺の生物が液状化した後、燃焼することが明らかになっています。\nその際、強いアルコール臭があること、成分の見識から液体はウィスキーであることが明らかになっています。",
            "selectedKeywords": [
                "ピエロ",
                "ウイスキー",
                "タバコ"
            ],
            "containmentProcedures": "このオブジェクトはサイト●の最奥部にある厳重警戒管理区域の電圧制御チャンバーにて1時間に1回高濃度の王水を注入し、スクラントン現実鋲で囲むことで収容されています。\nこのオブジェクトの収容されている厳重警戒管理区域では一切の喫煙は禁止されており、仮に喫煙者が発見された場合機動部隊により即刻終了されます"
        },
        "author_ids": [
            "f5144671-5f0f-4652-be4d-c9f1fcbd1df0",
            "6479ccb2-f6ce-4353-8331-89452c7714a6",
            "ee06ab5c-71ac-45d0-9b7c-d00687a57491"
        ],
        "created_at": "2025-11-28 13:09:24.102365+00",
        "is_hidden": false
    },
    {
        "id": "d59c15ab-9a61-4191-98d8-f0f4deae2ff2",
        "title": "窓の向こうのおもちゃ箱",
        "content": {
            "conclusion": "このオブジェクトは198●年に突如として美術館内に出現したところを美術館内に潜入していた財団エージェントにより発見されました。\n現状危険性が薄く、こちら側からの侵入しか鑑賞手段が確認されないためステンドグラスに囲われた状態で定期的に捏造したストーリーをスピーカにて紹介し、一般に公開されています\n\n\n\n【1件のメールが届いています】\n送り主：財団人事管理課課長●●●氏\n件名：無断採用をやめてくれ\n」\n」\n」\n　現場の人手不足は重々承知しているが職員の採用についてはよほどの緊急性がない限り即時採用はできないはずだ。\nそんな頻繁にポコポコ現場で採用されちゃあおちおち管理もくそもあったもんじゃない。\n新規採用の記録もなく職員が増えているのはアンタラのせいだろ？\n先月だけでも125名の現場での新規採用だ。\n俺の部下の一人が出勤して書類の山が築かれたテーブルを見て泡吹いて倒れた。\nあんたらちゃんと財団の心理カウンセリング受けてんだよなぁ？？？？\n頼むから絶対にするなとは言わないから、いやもうやめてくれ。お願いだ。\n戸籍も分からない、人かどうかも分からない奴なんか勧誘しないでくれ",
            "constraint": {
                "id": "constraint-0.6953442782337715",
                "hiddenDescription": "この異空間への入り口は、実は一方通行ではない。異空間の住人が財団世界に侵入してきている、または財団が異空間の住人を誘引している。",
                "publicDescriptions": [
                    "Euclid",
                    "次元の裂け目",
                    "内部の物理法則が異なる",
                    "内部の資源の利用が検討されている"
                ]
            },
            "descriptionLate": "",
            "descriptionEarly": "このオブジェクトは、特殊な異世界と連絡している8メートル四方の空間の裂け目です。\n美術館においては、前衛芸術展示に擬態する形で展示しています。\n空間の裂け目の向こう側には、子供部屋を思わせるようなおもちゃやベビーベッドなどが、\n一般的なものと比べて8倍ほどのサイズで存在していることを確認することができます。\nこの裂け目を閉じようとする試みは現状では失敗しています。\nDクラス職員による異世界の探索の試みは現在までに7回行われていますが、いずれも15分以内に消息を絶ってしまっています。\nこれまでのところ、裂け目の向こう側から何者かが能動的にこちらに出現したことは観測されていません。",
            "selectedKeywords": [
                "スピーカー",
                "ステンドグラス",
                "ぬいぐるみ"
            ],
            "containmentProcedures": "このオブジェクトは、某国の美術館内にて実際に展示されているものです。\n美術館内の監視カメラによる継続的な監視と、２時間おきの財団関係者による見回りにより\n監視・経過の観察がされています。"
        },
        "author_ids": [
            "6479ccb2-f6ce-4353-8331-89452c7714a6",
            "ee06ab5c-71ac-45d0-9b7c-d00687a57491",
            "f5144671-5f0f-4652-be4d-c9f1fcbd1df0"
        ],
        "created_at": "2025-11-28 13:09:24.102365+00",
        "is_hidden": false
    },
    {
        "id": "10b70616-a2db-4579-b4ed-1648e3840c3a",
        "title": "週末の着信音",
        "content": {
            "conclusion": "\n　当オブジェクトに共通する点として、交渉及び進言には、財団の管理する管理番号××ー×××のスマートフォンを使用することができます。\n　また、該当スマートフォンの破損の場合、××博士の下に早急に送り届けてください。\n\n\n【××博士の記録音声より】\n\nIs　「では今回の降臨も無事に行われると？」\nXx　「あぁ……毎度毎度肝を冷やしているがね。何せ普通に携帯にメッセときたものだ。庶民的にすら感じてしまうよ」\nIs　「降臨は決まって日曜日でしたかね」\nXx　「週末の予定を立てているところにいやな着信音ときたものだ。どこぞの上司と変わらん。上に頭が上がらんのは同じ事さ。」\n\n\n\n\n\n\n\n\n\n\n\n　\n【Clearance Level 5以上閲覧可能】\n　当SCPとの接触記録は、財団内の一部に秘匿情報として管理。\n　また、接触した職員の記憶改竄と精神安定の処理を行うこと。\n\n\n\n\n\n\n\n　",
            "constraint": {
                "id": "constraint-0.9853884177778334",
                "hiddenDescription": "財団は、このSCPを隠蔽するだけでなく、積極的に「利用」している。世界の安定化、特定の勢力への干渉、他のSCPの封じ込めなど、より高次の目的のために。",
                "publicDescriptions": [
                    "Euclid",
                    "高次元の存在",
                    "世界の法則に影響を与える",
                    "財団の歴史と深く関係している"
                ]
            },
            "descriptionLate": "",
            "descriptionEarly": "　このオブジェクトは異次元に存在する高次元の存在です。形状は観測する者によりさまざまで、中には管楽器を携えた7つの頭を持つ天使に見えたとの証言もあります。\n　3か月に1度の頻度で出現することが確認されており、財団と高次元存在の間で特定の場所に出現するよう交渉がなされた結果\n高次元存在の提案により現存する「電柱」に出現すると確約されています。\n　また、高次元存在とは現状奇跡的に中立を保てていますが財団の高次元存在への理解が浅く非常に危うい状況です。\n過去に起こした事例の中では鳴き声（いくつものラッパがなるような音）をあげた次の瞬間地球上から●●●●が消滅したことが確認されています",
            "selectedKeywords": [
                "電柱",
                "ギター",
                "スマートフォン"
            ],
            "containmentProcedures": "3ヶ月に一度の降臨の際には、予言者による位置予測を厳密に行った上、降臨する地域に3日以上前から確実に準備し、送迎の儀式を間違いなく行うようにしてください。\n儀式の後、ギターが残された場合には、サイト✘✘✘の✘✘博士に必ず届けるようにしてください。"
        },
        "author_ids": [
            "ee06ab5c-71ac-45d0-9b7c-d00687a57491",
            "f5144671-5f0f-4652-be4d-c9f1fcbd1df0",
            "6479ccb2-f6ce-4353-8331-89452c7714a6"
        ],
        "created_at": "2025-11-28 13:09:24.102365+00",
        "is_hidden": false
    }
];

export default function DClassMockLobby() {
    const [reports] = useState<Report[]>(MOCK_REPORTS);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const getReportPreview = (content: any) => {
        if (!content) return '';
        // Simulate the bug: try to parse it if it's a string, or just return it if it's an object
        // The bug in the main page is likely that it expects a string to parse, but gets an object,
        // OR it parses successfully but then tries to use it as a string.

        // Let's replicate the EXACT logic from the main page to see if it crashes
        try {
            // If content is already an object (which it is in this mock data), 
            // JSON.parse(content) will throw "Unexpected token o in JSON at position 1"
            // because it tries to parse "[object Object]"
            const parsed = typeof content === 'string' ? JSON.parse(content) : content;

            if (parsed && typeof parsed === 'object') {
                if (parsed.descriptionEarly || parsed.descriptionLate) {
                    return parsed.descriptionEarly || parsed.descriptionLate;
                }
            }
            return typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
        } catch (e) {
            return content;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return 'Unknown Date';
        }
    };

    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-4 md:p-8 flex flex-col items-center">
            <div className="absolute top-0 left-0 bg-yellow-500 text-black px-2 py-1 font-bold z-50">
                MOCK ENVIRONMENT
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center uppercase tracking-widest text-scp-red">
                D-Class Assignment Terminal (MOCK)
            </h1>
            <p className="text-scp-red-dim text-sm mb-8 uppercase tracking-wider">
                Select a file to initiate exploration protocol.
            </p>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                {/* Report List */}
                <div className="border border-scp-green/30 bg-scp-green/5 p-4 flex flex-col">
                    <h2 className="text-xl font-bold mb-4 border-b border-scp-green/30 pb-2 uppercase">
                        Available Files
                    </h2>
                    <div className="overflow-y-auto custom-scrollbar flex-grow max-h-[60vh] md:max-h-[600px] space-y-2">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => setSelectedReport(report)}
                                className={`p-3 border cursor-pointer transition-colors uppercase tracking-wider text-sm ${selectedReport?.id === report.id
                                    ? 'bg-scp-red text-black border-scp-red font-bold'
                                    : 'border-scp-green/30 hover:bg-scp-green/10 text-scp-green'
                                    }`}
                            >
                                <div className="flex justify-between">
                                    <span>{report.title || 'Untitled'}</span>
                                    <span className="text-xs opacity-70">{formatDate(report.created_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Report Details */}
                <div className="border border-scp-green/30 bg-black p-6 flex flex-col relative">
                    {selectedReport ? (
                        <>
                            <div className="absolute top-0 right-0 p-2 text-xs text-scp-red border-b border-l border-scp-red/50 uppercase tracking-widest">
                                Classified
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-scp-green uppercase tracking-widest border-b border-scp-green/50 pb-2">
                                {selectedReport.title || 'Untitled Report'}
                            </h2>
                            <div className="flex-grow overflow-y-auto custom-scrollbar mb-6 font-typewriter text-sm text-scp-green-dim whitespace-pre-wrap">
                                {/* This is where the crash happens if getReportPreview returns an object */}
                                {(getReportPreview(selectedReport.content) || '').substring(0, 500)}...
                                <br />
                                <br />
                                <span className="text-scp-red">[REMAINDER OF FILE ENCRYPTED UNTIL DEPLOYMENT]</span>
                            </div>
                            <button
                                className="w-full bg-scp-red text-black font-bold py-4 uppercase tracking-widest hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                            >
                                Initiate Protocol
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-scp-green-dim uppercase tracking-widest text-sm">
                            &lt; Select a file to view details &gt;
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
