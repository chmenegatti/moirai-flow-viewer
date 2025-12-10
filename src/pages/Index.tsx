import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchExchanges, fetchFlowchart } from "@/services/api";
import { Header } from "@/components/Header";
import { SearchInput } from "@/components/SearchInput";
import { ExchangeCard } from "@/components/ExchangeCard";
import { FlowchartViewer } from "@/components/FlowchartViewer";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [flowDirection, setFlowDirection] = useState<'LR' | 'TD'>('LR');
  const { toast } = useToast();

  const {
    data: exchangesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exchanges"],
    queryFn: fetchExchanges,
  });

  const flowchartMutation = useMutation({
    mutationFn: ({ exchange, direction }: { exchange: string; direction: 'LR' | 'TD' }) =>
      fetchFlowchart(exchange, direction),
    onError: (error) => {
      toast({
        title: "Error loading flowchart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleExchangeClick = (exchange: string) => {
    setSelectedExchange(exchange);
    flowchartMutation.mutate({ exchange, direction: flowDirection });
  };

  const handleCloseViewer = () => {
    setSelectedExchange(null);
    flowchartMutation.reset();
  };

  const handleDirectionChange = (direction: 'LR' | 'TD') => {
    setFlowDirection(direction);
    if (selectedExchange) {
      flowchartMutation.mutate({ exchange: selectedExchange, direction });
    }
  };

  const filteredExchanges = useMemo(() => {
    if (!exchangesData?.data?.exchanges) return [];
    if (!searchTerm) return exchangesData.data.exchanges;

    const term = searchTerm.toLowerCase();
    return exchangesData.data.exchanges.filter((exchange) =>
      exchange.toLowerCase().includes(term)
    );
  }, [exchangesData?.data?.exchanges, searchTerm]);

  const prefix = exchangesData?.data?.prefix;
  const totalCount = exchangesData?.data?.count;

  return (
    <div className="min-h-screen bg-background">
      <Header prefix={prefix} count={totalCount} />

      <main className="container px-4 py-8">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search exchanges by name..."
          />
          {searchTerm && filteredExchanges.length > 0 && (
            <p className="text-muted-foreground text-sm mt-3 text-center font-mono">
              Found{" "}
              <span className="text-monokai-green">{filteredExchanges.length}</span>{" "}
              {filteredExchanges.length === 1 ? "exchange" : "exchanges"}
            </p>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            message={error instanceof Error ? error.message : "Failed to load exchanges"}
            onRetry={() => refetch()}
          />
        ) : filteredExchanges.length === 0 ? (
          searchTerm ? (
            <EmptyState type="no-results" searchTerm={searchTerm} />
          ) : (
            <EmptyState type="no-data" />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredExchanges.map((exchange, index) => (
              <ExchangeCard
                key={exchange}
                name={exchange}
                index={index}
                onClick={() => handleExchangeClick(exchange)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Flowchart Viewer */}
      {selectedExchange && (
        <FlowchartViewer
          content={flowchartMutation.data || ""}
          exchangeName={selectedExchange}
          onClose={handleCloseViewer}
          direction={flowDirection}
          onDirectionChange={handleDirectionChange}
          isLoading={flowchartMutation.isPending}
        />
      )}
    </div>
  );
};

export default Index;
