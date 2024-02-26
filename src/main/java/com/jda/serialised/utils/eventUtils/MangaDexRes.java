package com.jda.serialised.utils.eventUtils;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.*;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MangaDexRes {
    public static class Root {
        @JsonProperty("data")
        private List<Data> data;

        public List<Data> getData() {
            return data;
        }

        public void setData(List<Data> data) {
            this.data = data;
        }
    }

    static class Data {
        @JsonProperty("id")
        private String id;
        @JsonProperty("type")
        private String type;
        @JsonProperty("attributes")
        private Attributes attributes;
        @JsonProperty("relationships")
        private List<Relationship> relationships;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Attributes getAttributes() {
            return attributes;
        }

        public void setAttributes(Attributes attributes) {
            this.attributes = attributes;
        }

        public List<Relationship> getRelationships() {
            return relationships;
        }

        public void setRelationships(List<Relationship> relationships) {
            this.relationships = relationships;
        }
    }

    static class Attributes {
        @JsonProperty("title")
        private Title title;
        @JsonProperty("description")
        private Description description;
        @JsonProperty("isLocked")
        private boolean isLocked;
        @JsonProperty("links")
        private Links links;
        @JsonProperty("lastVolume")
        private String lastVolume;
        @JsonProperty("lastChapter")
        private String lastChapter;
        @JsonProperty("status")
        private String status;
        @JsonProperty("year")
        private int year;
        @JsonProperty("contentRating")
        private String contentRating;
        @JsonProperty("tags")
        private List<Tag> tags;
        @JsonProperty("state")
        private String state;
        @JsonProperty("createdAt")
        private String createdAt;
        @JsonProperty("updatedAt")
        private String updatedAt;
        @JsonProperty("availableTranslatedLanguages")
        private List<String> availableTranslatedLanguages;

        public Title getTitle() {
            return title;
        }

        public void setTitle(Title title) {
            this.title = title;
        }

        public Description getDescription() {
            return description;
        }

        public void setDescription(Description description) {
            this.description = description;
        }

        public boolean isLocked() {
            return isLocked;
        }

        public void setLocked(boolean locked) {
            isLocked = locked;
        }

        public Links getLinks() {
            return links;
        }

        public void setLinks(Links links) {
            this.links = links;
        }

        public String getLastVolume() {
            return lastVolume;
        }

        public void setLastVolume(String lastVolume) {
            this.lastVolume = lastVolume;
        }

        public String getLastChapter() {
            return lastChapter;
        }

        public void setLastChapter(String lastChapter) {
            this.lastChapter = lastChapter;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public int getYear() {
            return year;
        }

        public void setYear(int year) {
            this.year = year;
        }

        public String getContentRating() {
            return contentRating;
        }

        public void setContentRating(String contentRating) {
            this.contentRating = contentRating;
        }

        public List<Tag> getTags() {
            return tags;
        }

        public void setTags(List<Tag> tags) {
            this.tags = tags;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(String updatedAt) {
            this.updatedAt = updatedAt;
        }

        public List<String> getAvailableTranslatedLanguages() {
            return availableTranslatedLanguages;
        }

        public void setAvailableTranslatedLanguages(List<String> availableTranslatedLanguages) {
            this.availableTranslatedLanguages = availableTranslatedLanguages;
        }
    }

    static class Title {
        @JsonProperty("en")
        private String en;

        public String getEn() {
            return en;
        }

        public void setEn(String en) {
            this.en = en;
        }
    }

    static class Description {
        @JsonProperty("en")
        private String en;

        public String getEn() {
            return en;
        }

        public void setEn(String en) {
            this.en = en;
        }
    }

    static class Links {
        @JsonProperty("al")
        private String al;
        @JsonProperty("ap")
        private String ap;
        @JsonProperty("kt")
        private String kt;
        @JsonProperty("mu")
        private String mu;
        @JsonProperty("nu")
        private String nu;
        @JsonProperty("mal")
        private String mal;
        @JsonProperty("raw")
        private String raw;
        @JsonProperty("engtl")
        private String engtl;

        public String getAl() {
            return al;
        }

        public void setAl(String al) {
            this.al = al;
        }

        public String getAp() {
            return ap;
        }

        public void setAp(String ap) {
            this.ap = ap;
        }

        public String getKt() {
            return kt;
        }

        public void setKt(String kt) {
            this.kt = kt;
        }

        public String getMu() {
            return mu;
        }

        public void setMu(String mu) {
            this.mu = mu;
        }

        public String getNu() {
            return nu;
        }

        public void setNu(String nu) {
            this.nu = nu;
        }

        public String getMal() {
            return mal;
        }

        public void setMal(String mal) {
            this.mal = mal;
        }

        public String getRaw() {
            return raw;
        }

        public void setRaw(String raw) {
            this.raw = raw;
        }

        public String getEngtl() {
            return engtl;
        }

        public void setEngtl(String engtl) {
            this.engtl = engtl;
        }
    }

    static class Tag {
        @JsonProperty("attributes")
        private TagAttributes attributes;

        public TagAttributes getAttributes() {
            return attributes;
        }

        public void setAttributes(TagAttributes attributes) {
            this.attributes = attributes;
        }
    }

    static class TagAttributes {
        @JsonProperty("name")
        private Name name;
        @JsonProperty("group")
        private String group;
        @JsonProperty("description")
        private Map<String, Object> description;

        public Name getName() {
            return name;
        }

        public void setName(Name name) {
            this.name = name;
        }

        public String getGroup() {
            return group;
        }

        public void setGroup(String group) {
            this.group = group;
        }

        public Map<String, Object> getDescription() {
            return description;
        }

        public void setDescription(Map<String, Object> description) {
            this.description = description;
        }
    }

    static class Name {
        @JsonProperty("en")
        private String en;

        public String getEn() {
            return en;
        }

        public void setEn(String en) {
            this.en = en;
        }
    }

    static class Relationship {
        @JsonProperty("id")
        private String id;
        @JsonProperty("type")
        private String type;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
