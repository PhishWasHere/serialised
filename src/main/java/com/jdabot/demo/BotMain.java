package com.jdabot.demo;

import com.jdabot.demo.events.EventListener;
import com.jdabot.demo.events.SlashEvent;
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder;
import net.dv8tion.jda.api.sharding.ShardManager;

import javax.security.auth.login.LoginException;

public class BotMain {
    protected static BotMain selfBot;
    private ShardManager shardManager = null;
    public BotMain(String token){
        try{
            shardManager = buildShardManager(token);
        } catch(LoginException e){
            System.out.println("Error: Failed to start bot. Check your token and try again.");
            System.exit(0);
        }
    }

    private ShardManager buildShardManager(String token) throws LoginException {
        DefaultShardManagerBuilder builder = DefaultShardManagerBuilder.createDefault(token).addEventListeners(new EventListener(this));

        return builder.build();
    }

    public ShardManager getShardManager() {
        return shardManager;
    }
}
