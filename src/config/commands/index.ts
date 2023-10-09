import { SlashCommandStringOption } from 'discord.js';

export const cmdArr = [
    {
      name: 'ping',
      description: 'Ping!',
    },
    {
      name: 'help',
      description: 'Shows the help menu',
    },
    {
      name: 'updated',
      description: 'checks to see if a manga was updated/is being updated on MangaDex',
      options: [
        new SlashCommandStringOption()
          .setName('manga')
          .setDescription('The manga to check')
          .setRequired(true),
      ],
    },
    {
      name: 'check-follow',
      description: 'checks your follow list to see if any manga is updated/being updated on MangaDex',
    },
    // {
    //   name: 'check-list',
    //   description: 'checks a MangaDex list to see if any manga is updated/being updated on MangaDex (the list must be public)',
    //   options: [
    //     new SlashCommandStringOption()
    //       .setName('list link')
    //       .setDescription('The link for the public list')
    //       .setRequired(true),
    //   ]
    // }
];