export interface Ruleset {
    id: string;
    name: { ja: string; en: string };
    difficulty: 'A' | 'B' | 'C';
    front_rules: {
        object_class: { ja: string; en: string }[];
        scp_nature: { ja: string; en: string }[];
        observation_feature: { ja: string; en: string }[];
        foundation_response: { ja: string; en: string }[];
    };
    back_rules: { ja: string; en: string }[];
}

export const RULESETS: Ruleset[] = [
    {
        id: "A",
        name: { ja: "避けられない脅威 / 絶望的な状況", en: "Inevitable Threat / Hopeless Situation" },
        difficulty: "B",
        front_rules: {
            object_class: [
                { ja: "Euclid", en: "Euclid" },
                { ja: "Keter", en: "Keter" },
                { ja: "Apollyon", en: "Apollyon" }
            ],
            scp_nature: [
                { ja: "物理的な存在", en: "Physical Entity" },
                { ja: "エネルギー体", en: "Energy Being" },
                { ja: "不可視の存在", en: "Invisible Entity" },
                { ja: "概念、または概念が具現化した実体/現象", en: "Concept, or Entity/Phenomenon Embodying a Concept" }
            ],
            observation_feature: [
                { ja: "常に感知されるものがある", en: "Always Perceptible" },
                { ja: "特定の状況でしか現れない", en: "Appears Only in Specific Situations" },
                { ja: "見たり聞いたりすると影響を受ける", en: "Affects Observer via Sight/Sound" },
                { ja: "周囲の環境を変化させる", en: "Alters Surrounding Environment" },
                { ja: "観測自体が危険である", en: "Observation Itself is Dangerous" }
            ],
            foundation_response: [
                { ja: "厳重な封じ込めが試みられている", en: "Strict Containment Attempted" },
                { ja: "観察と記録が主な対応である", en: "Observation and Recording are Primary Responses" },
                { ja: "特定の対策が繰り返し失敗している", en: "Specific Countermeasures Repeatedly Fail" },
                { ja: "存在の隠蔽が最優先されている", en: "Concealment of Existence is Critical" },
                { ja: "恒久的な収容は不可能とされている", en: "Permanent Containment Deemed Impossible" }
            ]
        },
        back_rules: [
            { ja: "このSCPはSCP財団に収容を許さないような絶対的な能力を持っている。", en: "This SCP possesses absolute abilities that reject Foundation containment." },
            { ja: "このSCPによる被害は、実は財団が隠蔽しているより大規模な脅威の一部であり、このSCPは「兆候」に過ぎない。", en: "The damage caused by this SCP is merely a symptom of a larger threat concealed by the Foundation." },
            { ja: "このSCPの脅威は、実は人類の特定の行動によって活性化・悪化するが、その行動は日常に溶け込んでいる。", en: "This SCP's threat is activated/worsened by specific human actions that are mundane and widespread." }
        ]
    },
    {
        id: "B",
        name: { ja: "意思疎通可能な存在 / 倫理的葛藤", en: "Communicable Entity / Ethical Conflict" },
        difficulty: "B",
        front_rules: {
            object_class: [
                { ja: "Safe", en: "Safe" },
                { ja: "Euclid", en: "Euclid" }
            ],
            scp_nature: [
                { ja: "知性を持つ存在", en: "Intelligent Entity" },
                { ja: "意思を持つオブジェクト", en: "Sentient Object" },
                { ja: "周囲に影響を与える概念、または概念を表現する実体", en: "Concept Affecting Surroundings, or Entity Expressing It" },
                { ja: "自律的なシステム、機構", en: "Autonomous System or Mechanism" }
            ],
            observation_feature: [
                { ja: "特定の刺激に反応する", en: "Reacts to Specific Stimuli" },
                { ja: "コミュニケーションの試みがある", en: "Attempts Communication" },
                { ja: "周囲の意識に影響を与える", en: "Affects Surrounding Consciousness" },
                { ja: "特定の情報を通じてのみ認識される", en: "Perceived Only Through Specific Information" },
                { ja: "感情や思考を読み取る", en: "Reads Emotions or Thoughts" }
            ],
            foundation_response: [
                { ja: "意思疎通の試みが継続されている", en: "Communication Attempts Ongoing" },
                { ja: "倫理的な議論が繰り返されている", en: "Ethical Debates Recurring" },
                { ja: "特定のDクラス職員が関与している", en: "Specific D-Class Personnel Involved" },
                { ja: "SCPの目的を解明しようとしている", en: "Attempting to Decipher SCP's Objectives" },
                { ja: "その主張や情報が真実か疑われている", en: "Truthfulness of Claims Doubted" }
            ]
        },
        back_rules: [
            { ja: "このSCPの意思疎通能力は偽装であり、本当の目的は財団から[特定の情報/物品/人物]を引き出すことである。その情報は財団の根幹に関わる。", en: "The SCP's communication is a ruse; its true goal is extracting critical [Information/Item/Person] from the Foundation." },
            { ja: "このSCPが持つ倫理観は人類と根本的に異なり、財団が考える「善」とは全く異なる基準で行動している。", en: "The SCP's ethics are fundamentally alien, operating on a 'good' standard vastly different from the Foundation's." },
            { ja: "実はこのSCPは財団職員の誰か（Dクラス職員、研究員、O5評議会メンバーなど）の生まれ変わり、あるいはその思考の一部である。", en: "The SCP is actually the reincarnation or fragmented consciousness of a Foundation personnel/D-Class/O5 Member." }
        ]
    },
    {
        id: "C",
        name: { ja: "認識災害 / 情報災害 / 心理的影響", en: "Cognitohazard / Infohazard / Psychological Impact" },
        difficulty: "B",
        front_rules: {
            object_class: [
                { ja: "Euclid", en: "Euclid" },
                { ja: "Keter", en: "Keter" }
            ],
            scp_nature: [
                { ja: "情報あるいはその媒体", en: "Information or Media" },
                { ja: "知覚できる現象", en: "Perceptible Phenomenon" },
                { ja: "不可視の概念、または概念を誘発する実体", en: "Invisible Concept or Inducing Entity" },
                { ja: "特定の思考パターン、またはそれを誘発するもの", en: "Specific Thought Pattern or Trigger" },
                { ja: "特定の感覚情報、またはそれを誘発するもの", en: "Specific Sensory Info or Trigger" }
            ],
            observation_feature: [
                { ja: "特定の感覚を通じて影響を受ける", en: "Affects via Specific Sense" },
                { ja: "精神的な変調を引き起こす", en: "Causes Mental Alteration" },
                { ja: "認識そのものが変化する", en: "Alters Perception Itself" },
                { ja: "物理的な証拠がほとんどない", en: "Little Physical Evidence" },
                { ja: "連鎖的に広がる", en: "Spreads in a Chain Reaction" }
            ],
            foundation_response: [
                { ja: "記憶処理が頻繁に実施される", en: "Amnestics Frequently Administered" },
                { ja: "情報統制が厳しく行われている", en: "Strict Information Control" },
                { ja: "特定の情報が検閲されている", en: "Specific Information Censored" },
                { ja: "影響を受けた対象の観察が中心である", en: "Focus on Observing Affected Subjects" },
                { ja: "感染経路の特定が困難である", en: "Infection Route Hard to Identify" }
            ]
        },
        back_rules: [
            { ja: "このSCPの真の目的は、実は影響を受けた人間を通じて特定のメッセージを伝えることだが、そのメッセージは人類の脳では処理できない。", en: "The SCP's goal is conveying a message through victims, but the human brain cannot process it." },
            { ja: "このSCPは、実は別のより大規模な存在の「防衛システム」であり、人類を近づけさせないためにこのような影響を与えている。その存在は非常に強力である。", en: "The SCP is actually a defense system for a larger, powerful entity, keeping humanity away." },
            { ja: "財団がこのSCPに施している収容プロトコル自体が、SCPの能力を強化している、あるいは意図せずに新たな影響を生み出している。", en: "The containment procedures themselves are strengthening the SCP or inadvertently creating new effects." }
        ]
    },
    {
        id: "D",
        name: { ja: "予測不能な力 / 実験と結果", en: "Unpredictable Power / Experimentation and Results" },
        difficulty: "B",
        front_rules: {
            object_class: [
                { ja: "Safe", en: "Safe" },
                { ja: "Euclid", en: "Euclid" }
            ],
            scp_nature: [
                { ja: "ギミックを持つ存在", en: "Gimmick-Based Entity" },
                { ja: "影響を与える現象またはそれを起こす存在", en: "Influential Phenomenon or Causer" },
                { ja: "特定の条件下で活性化する場", en: "Field Activated under Conditions" },
                { ja: "生命体", en: "Lifeform" },
                { ja: "未知の法則を持つ装置", en: "Device with Unknown Laws" }
            ],
            observation_feature: [
                { ja: "入力に対して予期せぬ結果を生む", en: "Produces Unexpected Results from Input" },
                { ja: "特定の条件下で様々な変化を起こす", en: "Causes Changes under Specific Conditions" },
                { ja: "観測ごとに結果が異なる", en: "Results Vary with Each Observation" },
                { ja: "科学的な分析が困難である", en: "Scientific Analysis Difficult" },
                { ja: "複数の異常性が複合している", en: "Multiple Anomalies Combined" }
            ],
            foundation_response: [
                { ja: "実験が継続的に行われている", en: "Continuous Experimentation" },
                { ja: "潜在的な利用価値が模索されている", en: "Potential Utility Being Explored" },
                { ja: "安全な運用プロトコルが確立されている", en: "Safe Operation Protocols Established" },
                { ja: "結果の予測モデルが構築されている", en: "Predictive Models Being Built" },
                { ja: "倫理的な問題が浮上している", en: "Ethical Issues Arising" }
            ]
        },
        back_rules: [
            { ja: "このSCPは、実は未来の財団が過去に送った「自己修正ツール」であり、特定の歴史改変を目的としている。その改変は人類の存亡に関わる。", en: "This SCP is a self-correction tool sent by the future Foundation to alter history essential for survival." },
            { ja: "このSCPの予測不能な力は、実は意図的に操作されている。財団内または外部の勢力によって特定の結果へと誘導されている。", en: "The unpredictability is manipulated; internal or external forces are guiding it to specific outcomes." },
            { ja: "このSCPが生み出す「失敗作」こそが、真の目的であり、成功作はカモフラージュである。そしてその失敗作は非常に危険である。", en: "The 'failures' produced are the true goal, and the successes are camouflage. The failures are extremely dangerous." }
        ]
    },
    {
        id: "E",
        name: { ja: "無害 / 有益なアノマリー", en: "Harmless / Beneficial Anomaly" },
        difficulty: "C",
        front_rules: {
            object_class: [
                { ja: "Safe", en: "Safe" }
            ],
            scp_nature: [
                { ja: "小型の存在", en: "Small Entity" },
                { ja: "特定の効果をもたらす物", en: "Object with Specific Effect" },
                { ja: "心地よい感覚を引き起こす現象あるいは物体", en: "Phenomenon/Object Causing Pleasant Sensation" },
                { ja: "非活動的なオブジェクト", en: "Inert Object" },
                { ja: "具象化されたポジティブな概念あるいはそれを感じさせるもの", en: "Embodied Positive Concept" }
            ],
            observation_feature: [
                { ja: "精神的な安らぎを与える", en: "Provides Mental Comfort" },
                { ja: "特定の物理的効果をもたらす", en: "Produces Specific Physical Effects" },
                { ja: "周囲の雰囲気を和ませる", en: "Softens Atmosphere" },
                { ja: "特定の条件で活性化する", en: "Activates under Specific Conditions" },
                { ja: "接触者に好意を抱かせる", en: "Induces Affection in Subjects" }
            ],
            foundation_response: [
                { ja: "Dクラス職員のストレス軽減に利用される", en: "Used for D-Class Stress Relief" },
                { ja: "研究対象として定期的に観察される", en: "Regularly Observed as Research Subject" },
                { ja: "特定の職員にのみ接触が許可される", en: "Restricted Access to Specific Personnel" },
                { ja: "厳重に保護されている", en: "Strictly Protected" },
                { ja: "その存在が世界に良い影響を与えているとされている", en: "Believed to Benefit the World" }
            ]
        },
        back_rules: [
            { ja: "このSCPの「無害さ」は偽装であり、実は長期的に見ると人類に壊滅的な影響を与える。", en: "The harmlessness is a facade; it causes catastrophic long-term effects on humanity." },
            { ja: "このSCPは、実は別の非常に危険なSCPを封印している「鍵」である。その鍵が壊れると世界に終末が訪れる。", en: "This SCP is actually a 'key' sealing a dangerous entity. If broken, the world ends." },
            { ja: "このSCPの「有益な」効果は、財団が意図的に操作・演出しているものであり、本来のSCPの性質とは異なる。", en: "The beneficial effects are staged by the Foundation and differ from the SCP's true nature." }
        ]
    },
    {
        id: "F",
        name: { ja: "異空間 / 異世界への入り口", en: "Extradimensional / Portal to Another World" },
        difficulty: "A",
        front_rules: {
            object_class: [
                { ja: "Euclid", en: "Euclid" },
                { ja: "Keter", en: "Keter" },
                { ja: "Thaumiel", en: "Thaumiel" }
            ],
            scp_nature: [
                { ja: "特定の空間", en: "Specific Space" },
                { ja: "異常な構造物", en: "Anomalous Structure" },
                { ja: "特定の物理現象あるいはそれが起こる場所", en: "Specific Physics Phenomenon/Location" },
                { ja: "次元の裂け目", en: "Dimensional Rift" },
                { ja: "日常に潜む非日常の入り口", en: "Hidden Entrance in Daily Life" }
            ],
            observation_feature: [
                { ja: "内部の物理法則が通常と異なる", en: "Internal Physics Differ from Norm" },
                { ja: "特定の条件下でアクセス可能になる", en: "Accessible under Specific Conditions" },
                { ja: "内部から奇妙なものが現れる", en: "Strange Things Emerge from Within" },
                { ja: "時間の流れが歪む", en: "Time Flow is Distorted" },
                { ja: "探索が極めて危険である", en: "Exploration is Extremely Dangerous" }
            ],
            foundation_response: [
                { ja: "探査隊が派遣されている", en: "Exploration Teams Dispatched" },
                { ja: "境界の封鎖と隔離が最優先である", en: "Perimeter Lockdown is Priority" },
                { ja: "内部の環境に関する情報収集が急務である", en: "Urgent Data Collection on Interior" },
                { ja: "外部への影響拡大を防ぐプロトコルがある", en: "Protocols to Prevent External Breach" },
                { ja: "内部からの侵入者を阻止している", en: "Blocking Intruders from Within" }
            ]
        },
        back_rules: [
            { ja: "この異空間は、実は地球の未来の姿、あるいは過去の改変された姿であり、その中には人類の遺産が残されている。", en: "This space is actually Earth's future or altered past, containing human relics." },
            { ja: "この異空間への入り口は、実は一方通行ではない。異空間の住人が財団世界に侵入してきている、または財団が異空間の住人を誘引している。", en: "The portal is not one-way. Entities are invading, or the Foundation is luring them in." },
            { ja: "財団は、この異空間から特定の資源や情報を秘密裏に入手しており、それが財団の存続に不可欠だが、その代償は非常に大きい。", en: "The Foundation secretly harvests vital resources/intel from here, but at a terrible user." }
        ]
    },
    {
        id: "G",
        name: { ja: "財団の根源 / 世界の真実", en: "Foundation Origin / Truth of the World" },
        difficulty: "A",
        front_rules: {
            object_class: [
                { ja: "Keter", en: "Keter" },
                { ja: "Apollyon", en: "Apollyon" },
                { ja: "Thaumiel", en: "Thaumiel" }
            ],
            scp_nature: [
                { ja: "概念", en: "Concept" },
                { ja: "情報体", en: "Informational Entity" },
                { ja: "高次元の存在", en: "Higher-Dimensional Being" },
                { ja: "歴史的な出来事", en: "Historical Event" },
                { ja: "世界そのものに関わる現象", en: "World-Altering Phenomenon" }
            ],
            observation_feature: [
                { ja: "世界の法則に影響を与える", en: "Affects World Laws" },
                { ja: "現実そのものを改変する", en: "Alters Reality Itself" },
                { ja: "観測者の存在を不安定にする", en: "Destabilizes Observer's Existence" },
                { ja: "特定の条件下で認識可能になる", en: "Perceptible under Conditions" },
                { ja: "財団の存在そのものに関わる", en: "Relates to Foundation's Existence" }
            ],
            foundation_response: [
                { ja: "厳重な情報隠蔽がなされている", en: "Strict Information Cover-up" },
                { ja: "O5評議会が直接関与している", en: "Direct O5 Council Involvement" },
                { ja: "財団の歴史と深く関係している", en: "Deeply Linked to Foundation History" },
                { ja: "人類の存続に関わる重大な秘密である", en: "Critical Secret for Human Survival" },
                { ja: "真実が露呈すると壊滅的である", en: "Truth Exposure would be Catastrophic" }
            ]
        },
        back_rules: [
            { ja: "このSCPの存在そのものが、財団の「記憶処理」によって作られた幻想である。財団は自らによって作り出された幻想の中で活動している。", en: "The SCP is a delusion created by Foundation amnestics. The Foundation operates within its own self-made illusion." },
            { ja: "財団は、このSCPを隠蔽するだけでなく、積極的に「利用」している。世界の安定化、特定の勢力への干渉、他のSCPの封じ込めなど、より高次の目的のために。", en: "The Foundation actively 'uses' this SCP for stabilization, interference, or containing other SCPs." },
            { ja: "このSCPがもたらす「世界の真実」は、実は人類が理解できない、あるいは受け入れられない形で提示されており、財団はその真実を隠蔽している。その真実は人類の存在そのものを脅かす。", en: "The 'World Truth' is incomprehensible or unacceptable to humans. The Foundation hides it because it threatens existence itself." }
        ]
    },
    {
        id: "H",
        name: { ja: "純粋な恐怖 / 定型的なホラー", en: "Pure Terror / Classic Horror" },
        difficulty: "C",
        front_rules: {
            object_class: [
                { ja: "Euclid", en: "Euclid" },
                { ja: "Keter", en: "Keter" }
            ],
            scp_nature: [
                { ja: "生物", en: "Creature" },
                { ja: "特定の状況で起こる現象", en: "Situational Phenomenon" },
                { ja: "物体", en: "Object" },
                { ja: "非実体的な存在", en: "Incorporeal Entity" },
                { ja: "日常に潜む恐怖の具現化", en: "Embodiment of Daily Fear" }
            ],
            observation_feature: [
                { ja: "精神的な恐怖を引き起こす", en: "Causes Mental Terror" },
                { ja: "物理的な危険をもたらす", en: "Poses Physical Danger" },
                { ja: "特定の状況下で活性化する", en: "Activates in Specific Situations" },
                { ja: "不可解な行動パターンを示す", en: "Shows Inexplicable Behavior" },
                { ja: "対象を追跡する", en: "Tracks Targets" }
            ],
            foundation_response: [
                { ja: "接触が厳しく制限されている", en: "Strictly Limited Contact" },
                { ja: "心理学的な分析が試みられている", en: "Psychological Analysis Attempted" },
                { ja: "特定の収容プロトコルが必須である", en: "Specific Protocol Required" },
                { ja: "被害者の救助が困難である", en: "Victim Rescue Difficult" },
                { ja: "その存在が知られることを防いでいる", en: "Preventing Public Awareness" }
            ]
        },
        back_rules: [
            { ja: "このSCPが引き起こす恐怖は、実は財団が特定の目的のために「調整」しているものである。", en: "The terror caused is 'adjusted' by the Foundation for specific purposes." },
            { ja: "このSCPは、実は保護されるべき存在であり、その恐怖行動は「防衛反応」に過ぎない。", en: "The SCP is actually a victim needing protection; the horror is just a defensive reaction." },
            { ja: "このSCPは、特定の財団職員の「悪夢」が具現化したものであり、その職員が覚醒すれば消滅するが、その職員はSCPの恐怖に取り憑かれている。", en: "The SCP is a manifested nightmare of a specific staff member. It vanishes if they wake, but they are consumed by fear." }
        ]
    },
    {
        id: "I",
        name: { ja: "巨大な脅威 / 終末論的規模", en: "Colossal Threat / Eschatological Scale" },
        difficulty: "A",
        front_rules: {
            object_class: [
                { ja: "Keter", en: "Keter" },
                { ja: "Apollyon", en: "Apollyon" },
                { ja: "Thaumiel", en: "Thaumiel" }
            ],
            scp_nature: [
                { ja: "広大な領域", en: "Vast Area" },
                { ja: "自然現象", en: "Natural Phenomenon" },
                { ja: "宇宙現象", en: "Cosmic Phenomenon" },
                { ja: "時間の流れに関わるもの", en: "Time-Related Entity" },
                { ja: "惑星規模の存在", en: "Planetary Scale Entity" },
                { ja: "なんらかの概念、またはそれが世界にもたらす影響", en: "Concept or World Impact" }
            ],
            observation_feature: [
                { ja: "広範囲に影響を及ぼす", en: "Affects Wide Area" },
                { ja: "時間や空間を歪める", en: "Distorts Time/Space" },
                { ja: "人類の存続を脅かす", en: "Threatens Human Survival" },
                { ja: "特定の周期で活性化する", en: "Activates Cyclically" },
                { ja: "観測が困難であるか、観測自体が危険である", en: "Observation Difficult or Dangerous" }
            ],
            foundation_response: [
                { ja: "大規模な隠蔽工作が進行中である", en: "Large-Scale Cover-up in Progress" },
                { ja: "国際的な協力体制が敷かれている", en: "International Cooperation Active" },
                { ja: "収容が極めて困難である", en: "Containment Extremely Difficult" },
                { ja: "人類の最終的な運命を左右する", en: "Determines Human Fate" },
                { ja: "財団の存在意義そのものに関わる", en: "Relates to Foundation's Raison d'être" }
            ]
        },
        back_rules: [
            { ja: "本当のObject Class: Thaumiel。財団は、この「巨大な脅威」を利用して別のより大きな脅威に対処しているが、その利用は常に世界終焉のリスクを伴う。", en: "True Class: Thaumiel. The Foundation uses this threat against a larger one, but risks world end." },
            { ja: "このSCPは、いつでも世界終焉をもたらすことのできるような力をもっており、SCP財団はそれを全く管理できていない。財団は、ただその終焉の時を遅らせる努力をしているに過ぎない。", en: "The SCP can end the world anytime. The Foundation has zero control, only delaying the inevitable." },
            { ja: "この「巨大な脅威」は、実は人類以外の別の知的生命体が作り出した「道具」であり、彼らの目的は人類には全く理解できず、人類は彼らの実験台に過ぎない。", en: "This threat is a 'tool' of alien intelligence with incomprehensible goals; humanity is just a test subject." }
        ]
    },
    {
        id: "P1",
        name: { ja: "個人的な変容 / 影響", en: "Personal Transformation / Influence" },
        difficulty: "C",
        front_rules: {
            object_class: [
                { ja: "Safe", en: "Safe" },
                { ja: "Euclid", en: "Euclid" }
            ],
            scp_nature: [
                { ja: "触れられる物", en: "Tangible Object" },
                { ja: "周囲に影響を与える現象", en: "Phenomenon Affecting Surroundings" },
                { ja: "絵、写真、模様、映像など", en: "Visual Media (Art, Photo, Pattern)" },
                { ja: "音声または音楽", en: "Sound or Music" },
                { ja: "特定の概念、または概念に影響を受ける実体", en: "Concept or Entity Affected by Concept" }
            ],
            observation_feature: [
                { ja: "接触者に特定の変化をもたらす", en: "Causes Changes in Subjects" },
                { ja: "精神状態に干渉する", en: "Interferes with Mental State" },
                { ja: "記憶を操作する", en: "Manipulates Memory" },
                { ja: "身体的な症状を引き起こす", en: "Causes Physical Symptoms" },
                { ja: "特定の思考を誘発する", en: "Induces Specific Thoughts" }
            ],
            foundation_response: [
                { ja: "被験者の経過観察が必須である", en: "Subject Observation Mandatory" },
                { ja: "特定のDクラス職員が関与している", en: "Specific D-Class Involved" },
                { ja: "影響を受けた対象の治療が試みられている", en: "Treatment Attempted on Subjects" },
                { ja: "影響範囲の特定と隔離が最優先である", en: "Scope ID and Isolation Priority" },
                { ja: "収容プロトコルは主に接触の制限である", en: "Protocol Mainly Limits Contact" }
            ]
        },
        back_rules: [
            { ja: "このSCPは、実は影響を受けた個人に新たな（意図せぬ）役割を与えようとしている。", en: "The SCP is actually trying to assign a new (unintended) role to the affected individual." },
            { ja: "このSCPによる変容は、実は別の巨大なSCPの覚醒や活動に必要な「触媒」である。", en: "The transformation is actually a 'catalyst' for waking/activating another massive SCP." },
            { ja: "財団は、このSCPがもたらす変化を、特定の目的のために秘密裏に研究・利用している。", en: "The Foundation secretly researches/uses these changes for a specific purpose." }
        ]
    },
    {
        id: "P2",
        name: { ja: "意図せぬ召喚 / 誘発", en: "Unintended Summoning / Triggering" },
        difficulty: "B",
        front_rules: {
            object_class: [
                { ja: "Euclid", en: "Euclid" },
                { ja: "Keter", en: "Keter" }
            ],
            scp_nature: [
                { ja: "特定の行動", en: "Specific Action" },
                { ja: "特定の物体", en: "Specific Object" },
                { ja: "特定の場所", en: "Specific Location" },
                { ja: "特定の感情あるいはそれを引き起こすもの", en: "Specific Emotion or Trigger" },
                { ja: "情報、または情報に誘発される存在", en: "Information or Entity Triggered by it" }
            ],
            observation_feature: [
                { ja: "条件を満たすと異常な存在が現れる", en: "Anomaly Appears on Condition" },
                { ja: "予測不能な現象が誘発される", en: "Unpredictable Phenomenon Triggered" },
                { ja: "特定の状況下で奇妙な音が聞こえる", en: "Strange Sounds in Specific Situations" },
                { ja: "関与した者の運命が変化する", en: "Participant's Fate Changes" },
                { ja: "活性化すると周囲に影響を及ぼす", en: "Affects Surroundings when Active" }
            ],
            foundation_response: [
                { ja: "誘発条件の解明が急務である", en: "Urgent Identification of Triggers" },
                { ja: "偶然の活性化を避けるためのプロトコルがある", en: "Protocols to Avoid Accidental Activation" },
                { ja: "出現した存在との接触が試みられている", en: "Contact Attempted with Entities" },
                { ja: "誘発された現象の記録が最優先である", en: "Recording Phenomenon is Priority" },
                { ja: "誘発された存在の再収容が困難である", en: "Re-containment is Difficult" }
            ]
        },
        back_rules: [
            { ja: "このSCPは、実は財団が意図的に「召喚」しようとしている別のSCPに対する、予期せぬ副産物である。", en: "This SCP is an unexpected byproduct of the Foundation trying to summon another SCP." },
            { ja: "この誘発される現象は、実は世界の崩壊を防ぐための「安全弁」である。", en: "The triggered phenomenon is actually a 'safety valve' preventing world collapse." },
            { ja: "このSCPの誘発条件は、実は過去に財団職員が行った特定の実験の結果として生まれたものである。", en: "The trigger condition was born from a past experiment by Foundation staff." }
        ]
    },
    {
        id: "P3",
        name: { ja: "共存する異質 / 日常の歪み", en: "Coexisting Anomaly / Distortion of Daily Life" },
        difficulty: "C",
        front_rules: {
            object_class: [
                { ja: "Safe", en: "Safe" },
                { ja: "Euclid", en: "Euclid" }
            ],
            scp_nature: [
                { ja: "生物", en: "Creature" },
                { ja: "オブジェクト", en: "Object" },
                { ja: "風景の一部あるいは特定の地域", en: "Part of Landscape or Area" },
                { ja: "特定の感覚", en: "Specific Sensation" },
                { ja: "日常に存在するが異常なもの", en: "Anomalous Thing in Daily Life" }
            ],
            observation_feature: [
                { ja: "日常に溶け込んでいるが異常な存在", en: "Blends in but Anomalous" },
                { ja: "特定の場所でしか認識されない", en: "Perceived Only in Specific Places" },
                { ja: "一般の人々には理解できない存在である", en: "Incomprehensible to Public" },
                { ja: "物理的な法則を無視して存在する", en: "Ignores Physical Laws" },
                { ja: "観測者によって認識が異なる", en: "Perception Varies by Observer" }
            ],
            foundation_response: [
                { ja: "情報統制とカバーストーリーの適用が必須である", en: "Info Control/Cover Stories Essential" },
                { ja: "一般社会からの隔離が困難である", en: "Isolation from Society Difficult" },
                { ja: "存在理由の解明が急務である", en: "Urgent Search for Reason of Existence" },
                { ja: "その存在が世界に与える影響を評価している", en: "Evaluating Global Impact" },
                { ja: "無害と判断されているため積極的に収容はされていない", en: "Not Actively Contained (Deemed Harmless)" }
            ]
        },
        back_rules: [
            { ja: "このSCPは、実はより大規模な異常存在の「一部」であり、本体は未発見である。", en: "This SCP is just a 'part' of a larger anomaly; the main body is undiscovered." },
            { ja: "このSCPの存在自体が、特定の歴史的出来事や大規模な現実改変の結果として生まれたものである。", en: "The SCP exists as a result of a specific historical event or mass reality shift." },
            { ja: "財団は、このSCPが日常に溶け込んでいることを利用し、別の異常存在から目を逸らさせている。", en: "The Foundation uses its mundane nature to distract from other anomalies." }
        ]
    },
    {
        id: "P4",
        name: { ja: "特殊な機能を持つオブジェクト / 道具", en: "Object with Special Function / Tool" },
        difficulty: "C",
        front_rules: {
            object_class: [
                { ja: "Safe", en: "Safe" },
                { ja: "Euclid", en: "Euclid" }
            ],
            scp_nature: [
                { ja: "道具", en: "Tool" },
                { ja: "機械", en: "Machine" },
                { ja: "加工品", en: "Artifact" },
                { ja: "日常的な物品", en: "Everyday Item" },
                { ja: "未知の素材で作られたもの", en: "Made of Unknown Material" }
            ],
            observation_feature: [
                { ja: "特定の操作で異常な機能を発揮する", en: "Functions Anomalously via Specific Op" },
                { ja: "入力に対して予期せぬ結果を生む", en: "Unexpected Output from Input" },
                { ja: "使用者の意図を反映する", en: "Reflects User's Intent" },
                { ja: "自律的に変化する", en: "Changes Autonomously" },
                { ja: "科学的に説明できない機能を持つ", en: "Scientifically Unexplainable Function" }
            ],
            foundation_response: [
                { ja: "安全な使用プロトコルが確立されている", en: "Safe Use Protocol Established" },
                { ja: "利用価値が模索されている", en: "Utility Being Explored" },
                { ja: "起源の解明が試みられている", en: "Origin Being Investigated" },
                { ja: "使用による長期的な影響が調査されている", en: "Long-term Usage Effects Studied" },
                { ja: "研究室での実験が中心である", en: "Lab Experiments are Central" }
            ]
        },
        back_rules: [
            { ja: "このSCPは、実は別の危険なSCPを収容または制御するための「鍵」である。", en: "This SCP is actually a 'key' to contain or control another dangerous SCP." },
            { ja: "このSCPの持つ特殊な機能は、実は未来の技術、あるいは宇宙外の文明の産物である。", en: "The function is actually product of future tech or extraterrestrial civilization." },
            { ja: "財団は、このSCPの機能を秘密裏に模倣し、自らの技術や戦略に利用しようとしている。", en: "The Foundation secretly mimics this function for its own tech/strategy." }
        ]
    },
    {
        id: "P5",
        name: { ja: "感情や意識への反応", en: "Reaction to Emotion / Consciousness" },
        difficulty: "B",
        front_rules: {
            object_class: [
                { ja: "Safe", en: "Safe" },
                { ja: "Euclid", en: "Euclid" },
                { ja: "Keter", en: "Keter" }
            ],
            scp_nature: [
                { ja: "生物", en: "Creature" },
                { ja: "オブジェクト", en: "Object" },
                { ja: "現象", en: "Phenomenon" },
                { ja: "概念、または感情を具現化した実体", en: "Concept or Emotion Embodiment" },
                { ja: "思考", en: "Thought" }
            ],
            observation_feature: [
                { ja: "特定の感情に反応して変化する", en: "Changes Reaction to Specific Emotion" },
                { ja: "観測者の思考を読み取る", en: "Reads Observer's Thoughts" },
                { ja: "意識に影響を与えて行動を変化させる", en: "Alters Behavior via Consciousness" },
                { ja: "願望を具現化する", en: "Manifests Desires" },
                { ja: "精神的な共鳴を引き起こす", en: "Causes Mental Resonance" }
            ],
            foundation_response: [
                { ja: "Dクラス職員による精神状態の管理が必須である", en: "Mental Mgmt of D-Class Mandatory" },
                { ja: "感情的な刺激を避けるプロトコルがある", en: "Protocol Avoids Emotional Stimuli" },
                { ja: "SCPの挙動パターンを分析している", en: "Analyzing Behavioral Patterns" },
                { ja: "倫理的な問題が議論されている", en: "Ethical Issues Debated" },
                { ja: "精神保護措置が必要である", en: "Mental Protection Measures Needed" }
            ]
        },
        back_rules: [
            { ja: "このSCPは、実は人間の感情や意識を「捕食」しており、反応するのは餌への誘因である。", en: "The SCP preys on emotions/consciousness; reaction is luring prey." },
            { ja: "このSCPの反応は、実は別のより高次の存在からの「通信」を翻訳しているに過ぎない。", en: "The reaction is just translating 'communication' from a higher entity." },
            { ja: "財団は、このSCPの能力を特定の目的のために、被験者の感情を意図的に操作して利用している。", en: "The Foundation intentionally manipulates subject emotions to use this capability." }
        ]
    },
    {
        id: "P6",
        name: { ja: "限定的な空間 / 環境の異常", en: "Confined Space / Environmental Anomaly" },
        difficulty: "B",
        front_rules: {
            object_class: [
                { ja: "Euclid", en: "Euclid" },
                { ja: "Keter", en: "Keter" }
            ],
            scp_nature: [
                { ja: "閉鎖空間", en: "Enclosed Space" },
                { ja: "特定の場所", en: "Specific Location" },
                { ja: "局所的な環境", en: "Local Environment" },
                { ja: "一時的な領域", en: "Temporary Zone" },
                { ja: "日常の風景に見えるが異質な空間", en: " Mundane-Looking but Alien Space" }
            ],
            observation_feature: [
                { ja: "内部の物理法則が通常と異なる", en: "Internal Physics Differ" },
                { ja: "特定の条件下でしかアクセスできない", en: "Accessible Only Under Conditions" },
                { ja: "内部に異常な生命体が存在する", en: "Anomalous Lifeforms Inside" },
                { ja: "時間が歪む現象が起きる", en: "Time Distortion Occurs" },
                { ja: "探索が極めて困難である", en: "Exploration Extremely Difficult" }
            ],
            foundation_response: [
                { ja: "探査隊の派遣が試みられている", en: "Exploration Team Dispatch Attempted" },
                { ja: "境界の封鎖と隔離が最優先である", en: "Perimeter Lockdown Priority" },
                { ja: "内部の環境に関する情報収集が急務である", en: "Urgent Interior Data Collection" },
                { ja: "外部への影響拡大を防ぐプロトコルがある", en: "Protocol Prevents External Spread" },
                { ja: "内部で発生した異常事態の解決が困難である", en: "Internal Anomalies Hard to Solve" }
            ]
        },
        back_rules: [
            { ja: "この限定的な空間は、実はより大規模な異常の「断片」であり、崩壊の兆候である。", en: "This space is a 'fragment' of a larger anomaly, a sign of collapse." },
            { ja: "この空間の異常性は、実は財団が過去に行った大規模な実験の結果として生まれたものである。", en: "The anomaly was born from a massive past Foundation experiment." },
            { ja: "財団は、この空間の異常性を利用して、別のSCPを収容するための「自然の檻」として活用している。", en: "The Foundation uses this anomaly as a 'natural cage' to contain another SCP." }
        ]
    },
    {
        id: "P7",
        name: { ja: "好戦的 / 危険な生物・集団", en: "Hostile / Dangerous Creature or Group" },
        difficulty: "C",
        front_rules: {
            object_class: [
                { ja: "Euclid", en: "Euclid" },
                { ja: "Keter", en: "Keter" }
            ],
            scp_nature: [
                { ja: "生物", en: "Creature" },
                { ja: "群れをなす生物", en: "Swarming Creature" },
                { ja: "小型の存在", en: "Small Entity" },
                { ja: "半実体的な存在", en: "Semi-Corporeal Entity" },
                { ja: "捕食性の高い存在", en: "Highly Predatory" }
            ],
            observation_feature: [
                { ja: "人間に対して明確な敵意を示す", en: "Shows Clear Hostility to Humans" },
                { ja: "予測不能な攻撃パターンを持つ", en: "Unpredictable Attack Patterns" },
                { ja: "群れで行動する", en: "In Swarms" },
                { ja: "特定の条件下で活性化する", en: "Activates under Conditions" },
                { ja: "生態系に影響を与える", en: "Affects Ecosystem" }
            ],
            foundation_response: [
                { ja: "直接的な排除が困難である", en: "Direct Elimination Difficult" },
                { ja: "行動パターンの分析が継続されている", en: "Behavior Analysis Ongoing" },
                { ja: "生息地の隔離が最優先である", en: "Habitat Isolation Priority" },
                { ja: "被害の拡大を防ぐためのプロトコルがある", en: "Protocol Prevents Damage Spread" },
                { ja: "その存在が知られるとパニックを引き起こす", en: "Awareness would Cause Panic" }
            ]
        },
        back_rules: [
            { ja: "このSCPの攻撃行動は、実は特定の外部勢力によって「誘導」されているものである。", en: "The aggression is actually 'guided' by a specific external force." },
            { ja: "このSCPは、実は人類以外の別の知性体の「家畜」あるいは「兵器」である。", en: "The SCP is actually 'cattle' or a 'weapon' of another intelligence." },
            { ja: "財団は、このSCPを利用して、特定の地域の人口密度を抑制している、あるいは別のSCPの行動を監視している。", en: "The Foundation uses the SCP to control population or monitor another SCP." }
        ]
    },
    {
        id: "P8",
        name: { ja: "記録・情報媒体の異常", en: "Recording / Media Anomaly" },
        difficulty: "C",
        front_rules: {
            object_class: [
                { ja: "Safe", en: "Safe" },
                { ja: "Euclid", en: "Euclid" }
            ],
            scp_nature: [
                { ja: "文書", en: "Document" },
                { ja: "映像", en: "Video" },
                { ja: "音声記録", en: "Audio Recording" },
                { ja: "電子データまたはその媒体", en: "Digital Data or Media" },
                { ja: "情報そのもの、または情報を伝える実体", en: "Information Itself or Carrier" }
            ],
            observation_feature: [
                { ja: "内容が常に変化する", en: "Content Constantly Changes" },
                { ja: "観測者に特定の情報や感情を伝える", en: "Conveys Info/Emotion to Observer" },
                { ja: "現実を書き換える情報を保持する", en: "Holds Reality-Rewriting Info" },
                { ja: "特定の条件下でしか内容が再生されない", en: "Plays Only under Conditions" },
                { ja: "アクセスすると精神に影響を及ぼす", en: "Mental Impact on Access" }
            ],
            foundation_response: [
                { ja: "情報統制と検閲が厳しく行われている", en: "Strict Info Control and Censorship" },
                { ja: "記録媒体の複製が禁止されている", en: "Duplication Prohibited" },
                { ja: "内容の分析と解読が試みられている", en: "Analysis/Deciphering Attempted" },
                { ja: "影響を受けた観測者の記憶処理が必須である", en: "Amnestics for Observers Mandatory" },
                { ja: "その情報源が不明である", en: "Source is Unknown" }
            ]
        },
        back_rules: [
            { ja: "このSCPが伝える情報は、実は財団が隠蔽している世界の真実への「ヒント」である。", en: "The info is a 'hint' to the global truth the Foundation is hiding." },
            { ja: "このSCPは、実は別のタイムラインあるいは次元からの「通信」である。", en: "This SCP is actually 'communication' from another timeline/dimension." },
            { ja: "財団は、このSCPの異常な記録を利用して、特定の情報を意図的に広めたり、削除したりしている。", en: "The Foundation uses these records to intentionally spread or delete specific info." }
        ]
    }
];
