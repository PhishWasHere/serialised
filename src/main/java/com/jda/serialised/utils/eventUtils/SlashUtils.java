package com.jda.serialised.utils.eventUtils;

import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Scanner;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.google.gson.Gson;

public class SlashUtils {
    public MangaDexRes getSingle(String title) {
        try {
            System.out.println(title);
            String apiUrl = "https://api.mangadex.org/manga?title=" + title + "&limit=1";

            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");

            int resCode = connection.getResponseCode();

//            if (resCode != 200) {
//                connection.disconnect();
//
//                JSONObject err = new JSONObject();
//                err.put("status:", resCode);
//                err.put("error:", connection.getResponseMessage());
//
//                return err;
//            }

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder stringBuilder = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                stringBuilder.append(inputLine);
            }
            in.close();

//            System.out.println(stringBuilder);

//            Gson gson = new Gson();
//            MangaDexRes test = gson.fromJson(stringBuilder.toString(), MangaDexRes.class);
//            System.out.println(test);

            ObjectMapper mapper = new ObjectMapper();
            MangaDexRes manga = mapper.readValue(String.valueOf(stringBuilder), MangaDexRes.class);

            MangaDexRes.Root root = new MangaDexRes.Root();

            List<MangaDexRes.Data> dataList = root.getData();
            System.out.println(dataList);
            for (MangaDexRes.Data data : dataList) {
                System.out.println("ID: " + data.getId());
                System.out.println("Type: " + data.getType());
            }

            connection.disconnect();

            return manga;

        } catch(IOException | JSONException err) {
            JSONObject errRes = new JSONObject();
            errRes.put("error:", err.getMessage());
            return null;
        }
    }
}
