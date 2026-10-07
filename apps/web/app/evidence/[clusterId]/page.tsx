import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrototypeFrame } from "@/components/layout/PrototypeFrame";

type ClusterEvidencePageProps = {
  params: Promise<{ clusterId: string }>;
};

export async function generateMetadata({ params }: ClusterEvidencePageProps): Promise<Metadata> {
  const { clusterId } = await params;
  return { title: `Cluster Evidence ${clusterId}` };
}

export default async function ClusterEvidencePage({ params }: ClusterEvidencePageProps) {
  const { clusterId } = await params;
  if (!clusterId.trim()) notFound();

  return <PrototypeFrame clusterId={clusterId} screen="cluster" />;
}
