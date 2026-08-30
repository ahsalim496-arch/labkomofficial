import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";
import { ArticleDetailPage, TutorialDetailPage } from "@/pages/ContentDetail";
import AdminDashboard from "@/pages/AdminDashboard";
import GalleryPage from "@/pages/GalleryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
          <Route path="/tutorial/:slug" element={<TutorialDetailPage />} />
          <Route path="/galeri" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
