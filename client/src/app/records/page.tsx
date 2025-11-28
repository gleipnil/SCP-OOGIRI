import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function RecordsPage() {
    const supabase = await createClient();
    const { data: reports, error } = await supabase
        .from('reports')
        .select('id, title, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reports:', error);
        return (
            <div className="min-h-screen bg-black text-scp-red font-mono flex items-center justify-center">
                <div className="border border-scp-red p-4 bg-scp-red/10 animate-pulse">
                    ERROR: FAILED TO ACCESS ARCHIVES
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-scp-green font-mono p-8 flex flex-col items-center">
            <div className="max-w-4xl w-full border-2 border-scp-green bg-black/90 p-8 shadow-[0_0_20px_rgba(0,255,65,0.2)] relative">
                <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest border-b border-scp-green pb-4">
                    SCP Foundation Archives
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reports?.map((report) => (
                        <Link
                            href={`/records/${report.id}`}
                            key={report.id}
                            className="block border border-scp-green/30 p-4 hover:bg-scp-green/10 transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold group-hover:text-white transition-colors">
                                    {report.title}
                                </h2>
                                <span className="text-xs text-scp-green-dim border border-scp-green/30 px-2 py-0.5">
                                    CONFIDENTIAL
                                </span>
                            </div>
                            <div className="text-xs text-scp-green-dim mt-2">
                                Filed: {new Date(report.created_at).toLocaleDateString()}
                            </div>
                        </Link>
                    ))}

                    {reports?.length === 0 && (
                        <div className="col-span-full text-center text-scp-green-dim py-12 uppercase tracking-widest">
                            No records found in the database.
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-block border border-scp-green text-scp-green px-6 py-2 hover:bg-scp-green hover:text-black transition-colors uppercase tracking-widest text-sm">
                        Return to Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
