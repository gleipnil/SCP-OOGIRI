import { GameState } from '../types';

export function generateGameLogMarkdown(gameState: GameState): string {
    const { users, reports } = gameState;
    const date = new Date().toLocaleString();

    let md = `# SCP Report Game Log\n\n`;
    md += `**Date:** ${date}\n`;
    md += `**Participants:** ${users.map(u => `${u.name} (${u.score} pts)`).join(', ')}\n\n`;
    md += `---\n\n`;

    reports.forEach((report, index) => {
        const owner = users.find(u => u.id === report.ownerId);

        md += `## Rank ${index + 1}: SCP-XXXX - ${report.title || "Untitled"}\n\n`;
        md += `**Author:** ${owner?.name || "Unknown"}\n`;
        md += `**Score:** ${owner?.score || 0} pts\n\n`;

        md += `### Constraints\n`;
        md += `- **Keywords:** ${report.selectedKeywords.join(', ')}\n`;
        md += `- **Public Constraints:**\n${report.constraint.publicDescriptions.map((d, i) => `  - ${["Object class", "SCPの性質", "観測時の特徴", "財団による対応"][i]}: ${d}`).join('\n')}\n`;
        md += `- **Hidden Constraint:** ${report.constraint.hiddenDescription}\n\n`;

        md += `### Special Containment Procedures\n`;
        md += `${report.containmentProcedures}\n\n`;

        md += `### Description\n`;
        md += `${report.descriptionEarly}\n\n`;
        md += `${report.descriptionLate}\n\n`;

        md += `### Addendum / Conclusion\n`;
        md += `${report.conclusion}\n\n`;

        md += `---\n\n`;
    });

    return md;
}
