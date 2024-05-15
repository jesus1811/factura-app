// import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { parse } from "cookie";

export const axiosInstance = axios.create({
  baseURL: "https://wajclqwuvmpszahaxxux.supabase.co/rest/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhamNscXd1dm1wc3phaGF4eHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2MjA4MjIsImV4cCI6MjAyNTE5NjgyMn0.BCQMbWRY7mjkIceoHRCE9W6Kzy0g8UL9KOZMCts9cXs",
    apikey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhamNscXd1dm1wc3phaGF4eHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2MjA4MjIsImV4cCI6MjAyNTE5NjgyMn0.BCQMbWRY7mjkIceoHRCE9W6Kzy0g8UL9KOZMCts9cXs",
  },
});

export const getAxiosConfig = () => {
  const token = typeof window !== "undefined" ? parse(document.cookie).access_token : null;
  return axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const supabaseUrl = "https://wajclqwuvmpszahaxxux.supabase.co";
// export const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhamNscXd1dm1wc3phaGF4eHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2MjA4MjIsImV4cCI6MjAyNTE5NjgyMn0.BCQMbWRY7mjkIceoHRCE9W6Kzy0g8UL9KOZMCts9cXs";
// export const supabase = createClient(supabaseUrl, supabaseKey);
