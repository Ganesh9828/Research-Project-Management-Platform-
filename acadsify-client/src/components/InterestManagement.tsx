import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; // Get saveUserInterests, user, and fetchUserInterests
import domainsData from "../research_domains_full_hierarchy.json";

const InterestManagement = () => {
  const { saveUserInterests, user, fetchUserInterests } = useAuth();
  const [interests, setInterests] = useState<string[]>([]);
  const [savedInterests, setSavedInterests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDomains, setFilteredDomains] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const getSelectableInterests = (data: { [key: string]: any }) => {
      let result: any[] = [];
      const addSplitTerms = (term: string) => {
        term.split('/').map(t => t.trim()).forEach(t => {
          if (t && !result.find(r => r.name === t)) {
            result.push({ name: t });
          }
        });
      };
      for (const [domain, subdomains] of Object.entries(data)) {
        // Add main domain as selectable interest
        addSplitTerms(domain);
        for (const [subdomain, topics] of Object.entries(subdomains as Record<string, string[]>)) {
          // Add subdomain as selectable interest
          addSplitTerms(subdomain);
          if (Array.isArray(topics)) {
            for (const topic of topics) {
              // Add topic as selectable interest
              addSplitTerms(topic);
            }
          }
        }
      }
      return result;
    };

    setFilteredDomains(getSelectableInterests(domainsData));
  }, []);





  useEffect(() => {
    const loadSavedInterests = async () => {
      if (user?.id) {
        const saved = await fetchUserInterests(user.id);
        setSavedInterests(saved || []);
        setInterests(saved || []);
      }
    };
    loadSavedInterests();
  }, [user, fetchUserInterests]);

  const handleAddInterest = (newInterest: string) => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleSaveInterests = async () => {
    const userId = user?.id;
    if (userId) {
      await saveUserInterests(interests, userId);
      setSavedInterests(interests);
      setEditMode(false);
    }
  };

  return (
    <div className="interest-management bg-card p-6 rounded-lg shadow-lg transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-6 text-primary-foreground">Manage Your Interests</h2>
      {!editMode ? (
        <>
          <ul className="saved-interests max-h-80 overflow-y-auto border border-border rounded-lg p-4 bg-background shadow-inner mb-6">
            {savedInterests.length === 0 ? (
              <li className="text-muted-foreground italic">No saved interests.</li>
            ) : (
              savedInterests.map((interest, index) => (
                <li key={index} className="text-foreground mb-2">
                  {interest}
                </li>
              ))
            )}
          </ul>
          <button
            onClick={() => setEditMode(true)}
            className="bg-primary text-primary-foreground p-3 rounded shadow-md hover:bg-primary/90 transition-colors duration-300"
          >
            Edit Interests
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-input rounded-lg p-3 mb-6 w-full placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary transition-colors duration-300"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="available-interests max-h-80 overflow-y-auto border border-border rounded-lg p-4 bg-background shadow-inner">
              <h3 className="text-lg font-semibold mb-4 text-primary-foreground">Available Interests</h3>
              <ul>
                {filteredDomains
              .filter(domainObj =>
                domainObj.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((domainObj, index) => (
                <li key={index} className="flex justify-between items-center mb-3 hover:bg-primary/10 rounded-md px-2 py-1 transition-colors duration-300 cursor-pointer">
                  <span className="text-foreground">{domainObj.name}</span>

                  <button
                    onClick={() => handleAddInterest(domainObj.name)}
                    disabled={interests.includes(domainObj.name)}
                    className={`transition-colors duration-300 ${interests.includes(domainObj.name) ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:text-primary/80"}`}
                  >
                    Add
                  </button>
                </li>
              ))}

              </ul>
            </div>
            <div className="selected-interests max-h-80 overflow-y-auto border border-border rounded-lg p-4 bg-background shadow-inner">
              <h3 className="text-lg font-semibold mb-4 text-primary-foreground">Selected Interests</h3>
              <ul>
                {interests.length === 0 && (
                  <li className="text-muted-foreground italic">No interests selected.</li>
                )}
                {interests.map((interest, index) => (
                  <li key={index} className="flex justify-between items-center mb-3 hover:bg-destructive/10 rounded-md px-2 py-1 transition-colors duration-300 cursor-pointer">
                    <span className="text-foreground">{interest}</span>
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-destructive hover:text-destructive/80 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={handleSaveInterests}
            className="mt-6 w-full bg-primary text-primary-foreground p-3 rounded shadow-md hover:bg-primary/90 transition-colors duration-300"
          >
            Save Interests
          </button>
        </>
      )}
    </div>
  );
};






export default InterestManagement;
