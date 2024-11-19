"use client";

import { useState } from "react";
import { Search, MapPin, Globe2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SearchResults from "@/components/search-results";
import LocationDialog from "@/components/location-dialog";
import PostcodeAutocomplete from "@/components/postcode-autocomplete";
import CountryPostcodeSearch from "@/components/country-postcode-search";
import LocationAutocomplete from "@/components/location-autocomplete";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BlogSection from "@/components/blog-section";
import InteractiveGlobe from "@/components/interactive-globe";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("postcode");
  const { toast } = useToast();

  const handleSearchResult = (result) => {
    setResults(result);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center gap-2">
              <Globe2 className="h-8 w-8" />
              Worldwide Postcode Search
            </h1>
            <p className="text-muted-foreground text-lg">
              Search postal codes and locations worldwide
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Postcode Search Options</CardTitle>
              <CardDescription>
                Find postcodes using different search methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="postcode">
                    <MapPin className="h-4 w-4 mr-2" />
                    By Postcode
                  </TabsTrigger>
                  <TabsTrigger value="country">
                    <Globe2 className="h-4 w-4 mr-2" />
                    By Country
                  </TabsTrigger>
                  <TabsTrigger value="location">
                    <Search className="h-4 w-4 mr-2" />
                    By Location
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="postcode">
                  <div className="space-y-4">
                    <PostcodeAutocomplete onSelect={handleSearchResult} />
                  </div>
                </TabsContent>

                <TabsContent value="country">
                  <div className="space-y-4">
                    <CountryPostcodeSearch onSelect={handleSearchResult} />
                  </div>
                </TabsContent>

                <TabsContent value="location">
                  <div className="space-y-4">
                    <LocationAutocomplete onSelect={handleSearchResult} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {results && <SearchResults results={results} />}
          <LocationDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            location={results}
          />

          <InteractiveGlobe searchResults={results} />
          <BlogSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}