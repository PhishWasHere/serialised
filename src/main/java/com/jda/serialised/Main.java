package com.jda.serialised;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String token = System.getenv("TOKEN");

        boolean loop = true;

        System.out.println("\\n=============================");
        System.out.println("Menu Options:");
        System.out.println(" 1 help | 2 set token | 3 start | 4 exit");
        System.out.println("=============================");


        try {
            while(loop) {
                int menuChoice = scanner.nextInt();

                switch (menuChoice) {
                    case 1:
                        System.out.println("To set the Discord token, select the token option(2) then provide the token and hit enter");
                        break;

                    case 2:
                        System.out.println("token:");
                        scanner.nextLine();
                        token = scanner.nextLine();
                        System.out.println("Token set:" + token);
                        System.out.println("Use 3 to start the bot, or 2 to set a different token");
                        break;

                    case 3:
                        if (token == null) {
                            System.out.println("No token provided, please provide a token with 2, or press 1 to get help");
                        }
                        BotMain.selfBot = new BotMain(token);
                        break;

                    case 4:
                        scanner.close();
                        loop = false;
                        break;

                    default:
                        System.out.println("=============================");
                        System.out.println("Invalid input, please use a valid menu option");
                        System.out.println("Menu Options:");
                        System.out.println(" 1 help | 2 token | 3 start | 4 exit");
                        System.out.println("=============================");
                        break;
                }
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            scanner.close();
            System.exit(0);
        }
    }
}