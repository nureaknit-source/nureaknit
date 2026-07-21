import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/typography";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "Belum ada data",
  message = "Konten akan segera hadir. Silakan cek kembali nanti.",
}: EmptyStateProps) {
  return (
    <Container size="sm">
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-light-gray p-6">
          <svg
            className="h-8 w-8 text-medium-gray"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal">
          {title}
        </h3>
        <Text size="sm" className="mt-2 max-w-xs">
          {message}
        </Text>
      </div>
    </Container>
  );
}
