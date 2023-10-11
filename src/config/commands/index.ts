import { SlashCommandStringOption } from 'discord.js';

export const cmdArr = [
    {
      name: 'ping',
      description: 'Ping!',
    },
    {
      name: 'help',
      description: 'Shows the help menu',
      options: [
        new SlashCommandStringOption()
          .setName('about')
          .setDescription('Get more info on the bot')
          .setRequired(false),

        new SlashCommandStringOption()
          .setName('privacy')
          .setDescription('Get more info on the bot\'s privacy policy')
          .setRequired(false),

        new SlashCommandStringOption()
          .setName('updated')
          .setDescription('Get more info on the /updated command')
          .setRequired(false),
          
        new SlashCommandStringOption()
          .setName('check-follow')
          .setDescription('Get more info on the /check-follow command')
          .setRequired(false),

        new SlashCommandStringOption()
          .setName('error')
          .setDescription('Get more info on common errors')
          .setRequired(false),
      ],
    },
    {
      name: 'updated',
      description: 'checks to see if a manga is being updated on MangaDex',
      options: [
        new SlashCommandStringOption()
          .setName('manga')
          .setDescription('The manga to check')
          .setMinLength(5)
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