package com.jda.serialised.utils.eventUtils;

import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class SlashUtils {
    public JSONObject getSingle(String title) throws Exception {
        try {
            String apiUrl = "https://api.mangadex.org/manga?title=" + title + "&limit=1";

            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");

            int resCode = connection.getResponseCode();

            if (resCode != HttpURLConnection.HTTP_OK) {
                JSONObject err = new JSONObject();
                err.put("status:", resCode);
                err.put("error:", "couldn't fetch from MangaDex");

                return err;
            }

        } catch(Exception err) {
            return err.getMessage().toString();
        }
    }
}
