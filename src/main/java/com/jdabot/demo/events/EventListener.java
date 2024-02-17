package com.jdabot.demo.events;

import com.jdabot.demo.BotMain;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.events.session.ReadyEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.Command;
import net.dv8tion.jda.api.interactions.commands.build.CommandData;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.requests.restaction.CommandListUpdateAction;
import net.dv8tion.jda.api.sharding.ShardManager;
import org.jetbrains.annotations.NotNull;

import com.jdabot.demo.events.SlashEvent;

import java.util.ArrayList;
import java.util.List;

public class EventListener extends ListenerAdapter {
    public BotMain bot;
    public EventListener(BotMain bot) {
        this.bot = bot;
    }
    SlashEvent slashEvent = new SlashEvent();

    @Override
    public void onReady(@NotNull ReadyEvent e) {
//        Work on removing commands later aasa
//        removeCommands(e);
        registerCommands(e);
    }
    private void removeCommands(@NotNull ReadyEvent e){
        try{
            System.out.println("Removing Old Commands");

            List<Command> commands = e.getJDA().retrieveCommands().complete();
            for (Command command : commands) {
                removeCommands(e);
            }

            System.out.println("Removed Commands");
        } catch (Exception err) {
            System.out.println("Error: Failed to remove commands" + err.getMessage());
            System.exit(0);
        }
    }
    private void registerCommands(@NotNull ReadyEvent e) {
        try {
            System.out.println("Generating Commands");

            List<CommandData> commands = new ArrayList<>();
            commands.add(Commands.slash("help", "show all commands, and get general help"));
            commands.add(Commands.slash("check follow", "login to your MangaDex account to check the status of all of your followed manga"));
            commands.add(Commands.slash("get update", "gets info on 1 manga"));
            commands.add(Commands.slash("play", "play music via a youtube link"));
            e.getJDA().updateCommands().addCommands(commands).queue();

            System.out.println("Commands Generated");
        } catch (Exception err) {
            System.out.println("Error: Commands failed to register" + err.getMessage());
            System.exit(0);
        }
    }

    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent e) {
        slashEvent.event(e);
    }
}
