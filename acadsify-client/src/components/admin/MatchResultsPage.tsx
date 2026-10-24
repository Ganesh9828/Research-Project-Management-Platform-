
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "../../types";
import { Sidebar } from "../layout/sidebar";
import { Header } from "../layout/header";

interface MatchResult {
  teacher: Profile;
  students: Profile[];
}

export function MatchResultsPage() {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [processError, setProcessError] = useState<string>("");

  const fetchMatchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/api/admin/matching-results");
      console.log("[MatchResultsPage] Fetched match results:", response.data);
      setMatchResults(response.data);
    } catch (err) {
      setError("Failed to fetch match results");
      console.error("[MatchResultsPage] Error fetching match results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchResults();
  }, []);

  const handleSuggestMatching = async () => {
    setProcessing(true);
    setProcessError("");
    try {
      await axios.post("http://localhost:4000/api/admin/assign-students-to-teachers");
      // After successful matching, refresh results
      await fetchMatchResults();
    } catch (err) {
      setProcessError("Failed to perform matching and send emails");
      console.error("[MatchResultsPage] Error performing matching:", err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div>Loading match results...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <Header />
          <h1 className="text-3xl font-bold mb-6">Match Results</h1>
          <button
            onClick={handleSuggestMatching}
            disabled={processing}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? "Processing..." : "Suggest Matching"}
          </button>
          {processError && <p className="text-red-600 mb-4">{processError}</p>}
          {matchResults.length === 0 ? (
            <p>No match results found.</p>
          ) : (
            <div className="space-y-8">
              {matchResults.map(({ teacher, students }) => (
                <div key={teacher.id} className="border rounded-lg p-4 shadow">
                  <h2 className="text-xl font-semibold mb-4">{teacher.full_name || teacher.email}</h2>
                  {students.length === 0 ? (
                    <p>No students assigned.</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-2">
                      {students.map((student, index) => (
                        <li key={student.id || index}>
                          {student.full_name || student.email}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
