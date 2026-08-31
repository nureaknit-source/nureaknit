import { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/typography";
import { FolderHeart } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = "Belum Ada Data",
  message = "Konten akan segera hadir. Silakan cek kembali nanti ya!",
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <Container size="sm" className={className}>
      <div className="flex min-h-[35vh] flex-col items-center justify-center text-center py-8">
        <div className="rounded-full bg-accent-subtle p-5 text-accent shadow-xs">
          {icon || <FolderHeart className="h-8 w-8 text-fg-muted" />}
        </div>
        <Heading as="h3" className="mt-4 text-lg sm:text-xl">
          {title}
        </Heading>
        <Text size="sm" className="mt-2 max-w-sm">
          {message}
        </Text>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </Container>
  );
}

