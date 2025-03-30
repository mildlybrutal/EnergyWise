"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Suggestion {
    suggestion: string;
    potentialSavingsUnits: number;
    potentialCostSavings: number;
}

interface MonthlyLogs {
    [month: string]: {
        unitsUsed: number;
        perUnitCost: number;
        totalBill: number;
        createdAt: string;
        suggestions: Suggestion[];
    }[];
}

export default function UsagePage() {
    const [logs, setLogs] = useState<MonthlyLogs>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const response = await axios.get("/api/logs");
                setLogs(response.data.logs);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchLogs();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Usage History</h1>
            {loading ? (
                <Skeleton className="w-full h-40" />
            ) : (
                Object.entries(logs).map(([month, logEntries]) => (
                    <div key={month}>
                        <h2 className="text-xl font-semibold mt-4">{month}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {logEntries.map((log, index) => (
                                <Card key={index} className="p-4">
                                    <CardContent>
                                        <p>
                                            <strong>Units Used:</strong>{" "}
                                            {log.unitsUsed} kWh
                                        </p>
                                        <p>
                                            <strong>Per Unit Cost:</strong> $
                                            {log.perUnitCost}
                                        </p>
                                        <p>
                                            <strong>Total Bill:</strong> $
                                            {log.totalBill}
                                        </p>
                                        <h3 className="font-semibold mt-2">
                                            Suggestions:
                                        </h3>
                                        <ul className="list-disc list-inside">
                                            {log.suggestions.map(
                                                (suggestion, idx) => (
                                                    <li key={idx}>
                                                        {suggestion.suggestion}{" "}
                                                        (Save{" "}
                                                        {
                                                            suggestion.potentialSavingsUnits
                                                        }{" "}
                                                        kWh / $
                                                        {
                                                            suggestion.potentialCostSavings
                                                        }
                                                        )
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
