package com.jda.serialised.events;

import com.jda.serialised.lavaPlayer.PlayerMain;
import net.dv8tion.jda.api.entities.GuildVoiceState;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import com.jda.serialised.utils.eventUtils.*;
import net.dv8tion.jda.api.interactions.commands.OptionMapping;
import net.dv8tion.jda.api.entities.Member;


public class SlashCommands {
    public void event(SlashCommandInteractionEvent e) {
        String command = e.getName();
        SlashUtils slashUtils = new SlashUtils();

        PlayerMain player = new PlayerMain();

        Member self = e.getGuild().getSelfMember();
        GuildVoiceState selfVoiceState = self.getVoiceState();

        switch (command) {
            case "help":
                e.reply("test").queue();
                break;

            case "check-follow":
                e.reply("test2").queue();
                break;

            case "get-update":
                OptionMapping option = e.getOption("manga-title");
                String title = option.getAsString();
                MangaDexRes res = slashUtils.getSingle(title);
//                System.out.println(res);
                e.reply("test3").queue();
                break;

            case "play":
                player.onPlay(e);
                break;

            case "skip":
                if (!selfVoiceState.inAudioChannel()) {
                    e.reply("Nothing in queue").queue();
                }
                player.onSkip(e);
                break;

            default:
                break;
        }
    }
}
