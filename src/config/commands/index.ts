import { SlashCommandStringOption } from 'discord.js';

export const cmdArr = [
    {
      name: 'ping',
      description: 'Ping!',
    },
    {
      name: 'updated',
      description: 'checks to see if a manga was updated',
      options: [
        new SlashCommandStringOption()
          .setName('manga')
          .setDescription('The manga to check')
          .setRequired(true),
      ],
    },
  ];