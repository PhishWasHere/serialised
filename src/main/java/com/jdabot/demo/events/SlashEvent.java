package com.jdabot.demo.events;

import com.jdabot.demo.BotMain;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class SlashEvent {
    public void event(SlashCommandInteractionEvent e) {
        String command = e.getName();

        switch (command) {
            case "help":
                e.reply("test").queue();
                break;

            case "check follow":
                e.reply("test2").queue();
                break;

            case "get update":
                e.reply("test3").queue();
                break;

            case "play":
                e.reply("test4").queue();
                break;

            default:
                break;
        }
    }
}
