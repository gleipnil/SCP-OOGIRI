import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LikeButton from '@/components/LikeButton';

export default async function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: report, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !report) {
        notFound();
    }

    const content = report.content;

    return (
        <div className="min-h-screen bg-black text-scp-text font-serif p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-[#f4f4f4] text-black p-8 shadow-lg border-t-[20px] border-t-[#700] relative">
                {/* Header */}
                <div className="border-b-2 border-black pb-4 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-wider">
                            SCP Foundation
                        </h1>
                        <div className="text-sm font-bold uppercase mt-1">
                            Secure. Contain. Protect.
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-[#700] uppercase">
                            Item #: {report.title}
                        </div>
                        <div className="text-sm font-bold uppercase mb-2">
                            Object Class: {content.constraint?.publicDescriptions?.[0] || 'Unknown'}
                        </div>
                        <LikeButton reportId={report.id} />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 text-sm md:text-base leading-relaxed">
                    <section>
                        <h2 className="font-bold uppercase mb-2">Special Containment Procedures:</h2>
                        <div className="whitespace-pre-wrap">{content.containmentProcedures}</div>
                    </section>

                    <section>
                        <h2 className="font-bold uppercase mb-2">Description:</h2>
                        <div className="whitespace-pre-wrap mb-4">{content.descriptionEarly}</div>
                        <div className="whitespace-pre-wrap">{content.descriptionLate}</div>
                    </section>

                    <section>
                        <h2 className="font-bold uppercase mb-2">Addendum:</h2>
                        <div className="whitespace-pre-wrap">{content.conclusion}</div>
                    </section>
                </div>

                {/* Footer / Metadata */}
                <div className="mt-12 pt-8 border-t border-black/20 text-xs text-gray-500 flex justify-between items-center">
                    <div>
                        Document ID: {report.id}
                        <br />
                        Date Filed: {new Date(report.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-right">
                        <div className="font-bold">Clearance Verified</div>
                        <div>{content.selectedKeywords?.join(', ')}</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="max-w-4xl mx-auto mt-8 flex justify-between font-mono">
                <Link href="/records" className="text-scp-green hover:underline">
                    &lt; Back to Archives
                </Link>
                <Link href="/" className="text-scp-green hover:underline">
                    Return to Terminal &gt;
                </Link>
            </div>
        </div>
    );
}
