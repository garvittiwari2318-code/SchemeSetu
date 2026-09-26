import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, ExternalLink, FileCheck2, FileText, ShieldCheck } from 'lucide-react';
import { getApplicationById } from '../api/applications';
import type { Application, ApplicationStatus } from '../api/types';

interface ApplicationWorkspaceProps {
  applicationId: string;
  onBackToResults: () => void;
}

const steps: ApplicationStatus[] = [
  'eligibility_confirmed',
  'documents_pending',
  'under_verification',
  'ready_for_submission',
  'submitted',
];

const labels: Record<ApplicationStatus, string> = {
  draft: 'Draft',
  eligibility_confirmed: 'Eligibility confirmed',
  documents_pending: 'Documents pending',
  under_verification: 'Under verification',
  ready_for_submission: 'Ready for submission',
  submitted: 'Submitted',
  under_review: 'Under review',
  approved: 'Approved',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function statusIndex(status: ApplicationStatus) {
  if (status === 'under_review' || status === 'approved') return steps.length;
  return Math.max(0, steps.indexOf(status));
}

export const ApplicationWorkspace: React.FC<ApplicationWorkspaceProps> = ({ applicationId, onBackToResults }) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getApplicationById(applicationId)
      .then((response) => {
        if (mounted) setApplication(response.data);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load the application.');
      });
    return () => { mounted = false; };
  }, [applicationId]);

  const completedDocuments = useMemo(
    () => application?.documents.filter((document) => document.status === 'verified').length ?? 0,
    [application],
  );

  if (error) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#fbf9f3] px-4 lg:px-10 py-12">
        <div className="max-w-[75rem] mx-auto">
          <button onClick={onBackToResults} className="inline-flex items-center gap-2 text-sm font-bold text-[#16324F] cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to results
          </button>
          <div className="mt-6 p-6 bg-white border border-[#C0392B]/20 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-[#C0392B] mb-2" />
            <h2 className="text-lg font-bold text-[#001d37]">Unable to load application</h2>
            <p className="text-sm text-[#43474d] mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#fbf9f3] flex items-center justify-center text-sm text-[#43474d]">
        Loading application record…
      </div>
    );
  }

  const currentIndex = statusIndex(application.status);
  const portalUrl = application.submission?.officialPortalUrl || application.scheme.officialPortalUrl || '';

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#fbf9f3] pb-16">
      <div className="bg-[#f5f3ed] border-y border-[#c3c6ce]/30">
        <div className="max-w-[75rem] mx-auto px-4 lg:px-10 py-5">
          <button onClick={onBackToResults} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#45617d] cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to scheme results
          </button>
          <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-[#2F6B4F]">Application record</p>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#001d37]">{application.scheme.name}</h1>
              <p className="text-xs text-[#43474d] mt-1">Application ID: {application._id}</p>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#c3c6ce]/50 text-xs font-bold text-[#16324F]">
              <Clock3 className="w-4 h-4" /> {labels[application.status]}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[75rem] mx-auto px-4 lg:px-10 pt-7 space-y-5">
        <section className="p-5 sm:p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck className="w-5 h-5 text-[#2F6B4F]" />
            <h2 className="font-bold text-[#001d37]">Application progress</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {steps.map((step, index) => {
              const done = index <= currentIndex;
              return (
                <div key={step} className="space-y-2">
                  <div className={`h-1.5 rounded-full ${done ? 'bg-[#2F6B4F]' : 'bg-[#d9d9d4]'}`} />
                  <p className={`text-xs font-semibold ${done ? 'text-[#16324F]' : 'text-[#74777e]'}`}>{labels[step]}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-5">
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#2F6B4F]" />
              <h2 className="font-bold text-[#001d37]">Eligibility assessment</h2>
            </div>
            <p className="text-sm text-[#43474d]">
              {application.evaluation.eligible ? 'The backend confirmed that this application meets the stored eligibility rules.' : 'The stored evaluation does not currently mark this application as eligible.'}
            </p>
            {application.evaluation.explanations.length > 0 && (
              <ul className="mt-4 space-y-2 text-xs text-[#43474d] list-disc pl-5">
                {application.evaluation.explanations.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            )}
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck2 className="w-5 h-5 text-[#2F6B4F]" />
              <h2 className="font-bold text-[#001d37]">Required documents</h2>
            </div>
            <p className="text-xs text-[#74777e] mb-3">{completedDocuments} of {application.documents.length} documents verified.</p>
            <div className="space-y-2">
              {application.documents.length === 0 ? (
                <p className="text-sm text-[#43474d]">No document requirements were supplied by the scheme record.</p>
              ) : application.documents.map((document) => (
                <div key={document.requirementId} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-[#f5f3ed] border border-[#c3c6ce]/20">
                  <div className="flex gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#45617d] shrink-0 mt-0.5" />
                    <div><p className="text-xs font-semibold text-[#1b1c18]">{document.name}</p>{document.mandatory && <span className="text-[10px] text-[#C0392B]">Mandatory</span>}</div>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-[#43474d]">{document.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-5 sm:p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-[#001d37]">Official application channel</h2>
              <p className="text-sm text-[#43474d] mt-1 max-w-2xl">SchemeSetu tracks your application record. Submission to the government is handled through the official channel unless a verified government API is explicitly integrated.</p>
            </div>
            {portalUrl && (
              <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#16324F] text-white text-xs font-bold hover:bg-[#10243a]">
                Visit Official Portal <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </section>

        <div className="grid sm:grid-cols-3 gap-3 text-xs text-[#43474d]">
          <div className="p-4 bg-white rounded-lg border border-[#c3c6ce]/30"><span className="font-bold block text-[#16324F]">Scheme version</span>{application.schemeVersion}</div>
          <div className="p-4 bg-white rounded-lg border border-[#c3c6ce]/30"><span className="font-bold block text-[#16324F]">Created</span>{formatDate(application.createdAt)}</div>
          <div className="p-4 bg-white rounded-lg border border-[#c3c6ce]/30"><span className="font-bold block text-[#16324F]">Last updated</span>{formatDate(application.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
};
