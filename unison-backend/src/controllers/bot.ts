import {
  Client,
  GatewayIntentBits,
  GuildMember,
  TextChannel
} from 'discord.js';
import { ObjectId, getRolebyServerId, updateChannelId } from './collab';
import { REST, Routes } from 'discord.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import Customer from '../models/customers';
import CollabPagenation from '../models/CollabPagenations';
import Collabs from '../models/Collabs';
import PendingProjects from '../models/PendingProjects';
import Projects from '../models/Projects';
import Guilds from '../models/Guilds';
import Winners from '../models/Winners';
import { CronJob } from 'cron';
import { getSocket } from './socket';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN as string;
const CLIENT_ID = process.env.CLIENT_ID as string;

export const connectBOT = async () => {
  client.on(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  const commands = [
    {
      name: 'post-announcements',
      description: 'Collab Announcements will be posted in the channel.'
    },
    {
      name: 'start',
      description: 'Replies with yes!'
    }
  ];

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();

  client.on(Events.InteractionCreate, async (interaction: any) => {
    if (interaction.commandName === 'post-announcements') {
      await updateChannelId({
        serverId: interaction.guildId,
        channelId: interaction.channelId
      });
      await interaction.reply(
        '@everyone Collab Announcements will be posted in the channel'
      );
    }

    if (interaction.componentType === ComponentType.Button) {
      ButtonCallback(interaction);
    } else {
      ModalCallback(interaction);
    }

    return;
  });

  client.on(Events.GuildMemberAdd, async (member: any) => {
    let { user, guild } = member;
    await assignRolebyuserid({
      userId: user.id,
      serverId: guild.id,
      mber: member
    });
  });
  client.on(Events.GuildCreate, async (member: any) => {
    checkerproject({ id: member.id });
  });

  client.login(TOKEN);

  const sesjob = new CronJob('*/30 * * * * *', async function () {
    FetchEndcollab();
    FetchInprogresscollab();
    FetchCountDownCollab();
  });
  sesjob.start();
};

export const checkerproject = async ({ id }: any) => {
  const project = await PendingProjects.findOneAndDelete({ serverId: id });
  if (project) {
    let query = {
      userId: project.userId,
      serverId: project.serverId,
      description: project.description,
      projectStatus: project.projectStatus,
      collabStatus: project.collabStatus,
      userType: project.userType,
      twitterLink: project.twitterLink,
      discordLink: project.discordLink
    };
    const newProject = new Projects(query);
    const nproject: any = await newProject.save();
    if (nproject) {
      const roleoptions: any = await getRolebyServerId(nproject.serverId);
      const io = getSocket();
      io.sockets.emit('addproject', { [nproject.serverId]: roleoptions });
    }
  }
};

export const MakeFakeData = async () => {
  for (let i = 0; i < 100; i++) {
    let row = {
      collabId: ObjectId('64247d6d01e43af6c0d5fe0f'),
      userId: '964023873555267585' + i,
      discriminator: '8143' + i,
      username: 'Primoz' + i
    };
    await Customer.findOneAndUpdate(
      { userId: row.userId, collabId: row.collabId },
      row,
      { upsert: true, new: true }
    );
  }
};

export const UpdateMessageId = async ({ collabid, messageId }: any) => {
  await Collabs.findByIdAndUpdate(collabid, { messageId });
  return;
};

export const postAnnouncement = async ({
  channelId,
  description,
  format,
  collabid,
  projectid
}: any) => {
  try {
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (format == 3) {
      const wdata = await setWhitelist({
        index: 0,
        collabid,
        ended: false,
        pickerbtn: false,
        projectid
      });
      const msg = await channel.send(wdata);
      await UpdateMessageId({ collabid, messageId: msg.id });
    } else {
      channel.send('@everyone ' + description);
    }
  } catch (error) {
    console.error(error);
  }
};

export const setPicker = async (params: any) => {
  const data = {
    userId: params.user.id,
    username: params.user.username,
    discriminator: params.user.discriminator,
    collabId: params.collabid
  };
  const up = await Customer.findOneAndUpdate(
    { userId: data.userId, collabId: data.collabId },
    data,
    { new: true, upsert: true }
  );
  const count = await Customer.countDocuments({ collabId: data.collabId });
  return count;
};

export const getPicker = async (params: any) => {
  const count = await Customer.countDocuments({ collabId: params });
  return count;
};

export const getConverForm = ({ index, show, particis }: any) => {
  const data = particis;
  let dstr: String = '';
  for (let i in data) {
    if (show == 'hide') {
      dstr +=
        Number(index) * 10 +
        Number(i) +
        1 +
        '.' +
        '<@' +
        data[i].userId +
        '>(1 entry)';
    } else {
      dstr +=
        Number(index) * 10 +
        Number(i) +
        1 +
        '.' +
        data[i].username +
        '#' +
        data[i].discriminator +
        '(1 entry)';
    }
    dstr += '\n';
  }
  return dstr;
};

export const ButtonCallback = async (interaction: any) => {
  const btnstr = interaction.customId;
  if (btnstr && btnstr.split(':').length >= 2) {
    const collabid = ObjectId(btnstr.split(':')[0]);
    const handlebtn = btnstr.split(':')[1];
    const projectid = btnstr.split(':')[2];
    switch (handlebtn) {
      case 'picker':
        const pickers = await setPicker({ collabid, user: interaction.user });
        const wdata = await setWhitelist({
          collabid,
          index: pickers,
          ended: false,
          pickerbtn: false,
          projectid
        });
        await interaction.update(wdata);
        break;
      case 'partici':
        const particis = await participantData({
          collabId: collabid,
          handle: 'start'
        });
        await interaction.reply(particis);
        break;
      case 'next':
      case 'prev':
        const particis1 = await participantData({
          collabId: collabid,
          handle: handlebtn
        });
        await interaction.update(particis1);
        break;
      case 'showusermentions':
        const particis2 = await participantData({
          collabId: collabid,
          handle: 'cmode'
        });
        await interaction.update(particis2);
        break;
      case 'Gotopage':
        showGotopgaeModal(interaction, collabid);
        break;
    }
  } else {
  }
  return;
};

export const ModalCallback = async (interaction: any) => {
  const btnstr = interaction.customId;
  if (btnstr && btnstr.split(':').length >= 2) {
    const collabid = btnstr.split(':')[0];
    const handlebtn = btnstr.split(':')[1];
    if (handlebtn == 'gotopagemodal') {
      const pagenumber =
        interaction.fields.getTextInputValue('pagenumberinput');
      const particis2 = await participantData({
        collabId: collabid,
        handle: 'spercialpage',
        pagenumber
      });
      if (particis2) {
        await interaction.update(particis2);
      }
    }
  }
};

export const participantData = async ({
  collabId,
  handle,
  pagenumber
}: any) => {
  const totalcount = await Customer.countDocuments({ collabId });
  let data: any = [];
  const totalPages = Math.ceil(totalcount / 10);
  let currentpage = 1;
  let prevbutton = true;
  let nextbutton = false;
  let mode = 'show';

  if (handle == 'start') {
    if (totalPages > 1) {
      nextbutton = false;
    } else {
      nextbutton = true;
    }

    await CollabPagenation.findOneAndUpdate(
      { collabId: collabId },
      { currentpage, collabId, mode },
      { upsert: true, new: true }
    );
  } else if (handle == 'prev') {
    data = await Customer.find({ collabId }).skip(0).limit(10);
    let params = await CollabPagenation.findOne({ collabId: collabId });
    currentpage = params.currentpage - 1;
    if (currentpage <= 1) {
      prevbutton = true;
    } else {
      prevbutton = false;
    }
    if (totalPages > 1) {
      nextbutton = false;
    } else {
    }
  } else if (handle == 'next') {
    data = await Customer.find({ collabId }).skip(0).limit(10);
    let params = await CollabPagenation.findOne({ collabId: collabId });
    currentpage = params.currentpage + 1;
    if (currentpage == totalPages) {
      nextbutton = true;
    } else {
    }
    prevbutton = false;
  } else if (handle == 'cmode') {
    let params = await CollabPagenation.findOne({ collabId: collabId });
    currentpage = params.currentpage;
    if (params.mode == 'show') {
      mode = 'hide';
    } else {
      mode = 'show';
    }
    await CollabPagenation.findOneAndUpdate(
      { collabId: params.collabId },
      { mode: mode }
    );
  } else if (handle == 'spercialpage') {
    if (pagenumber <= totalPages) {
      currentpage = pagenumber;
    } else {
      return null;
    }
  }
  await CollabPagenation.findOneAndUpdate(
    { collabId: collabId },
    { currentpage }
  );

  data = await Customer.find({ collabId })
    .skip(currentpage - 1)
    .limit(10);

  const particidata = getParticipants({
    collabid: collabId,
    show: mode,
    totalpage: totalPages,
    count: totalcount,
    currentpage: currentpage,
    prevbutton: prevbutton,
    nextbutton: nextbutton,
    formdata: getConverForm({
      index: currentpage - 1,
      show: mode,
      particis: data
    })
  });

  return particidata;
};

export const getParticipants = ({
  collabid,
  show,
  totalpage,
  count,
  currentpage,
  prevbutton,
  nextbutton,
  formdata
}: any) => {
  const row: any = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setCustomId(`${collabid}:prev`)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('◀️')
      .setDisabled(prevbutton),
    new ButtonBuilder()
      .setCustomId(`${collabid}:Gotopage`)
      .setLabel('Go To Page')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`${collabid}:next`)
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('▶️')
      .setDisabled(nextbutton)
  ]);
  const row1: any = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${collabid}:showusermentions:${show}`)
      .setStyle(ButtonStyle.Primary)
      .setLabel(show === 'show' ? 'Show User Mentions' : 'Show user Tags')
  );

  const embed = new EmbedBuilder()
    .setColor('#f95e4a')
    .setTitle(`Participants(page ${currentpage}/${totalpage})`)
    .setDescription(
     "These are the participants" +
        '\n ' +
        '\n' +
        formdata +
        '\n' +
        `Total Participants: ${count}`
    );

  return {
    content: '',
    ephemeral: true,
    embeds: [embed],
    components: [row, row1]
  };
};

export const ConverToTime = (time: any) => {
  const HH = Math.floor(time / 60);
  const MM = Math.round(time - HH * 60);
  return { expiretimemin: MM, expiretime: HH };
};

export const setWhitelist = async ({
  index,
  collabid,
  ended,
  winnersstr,
  pickerbtn,
  projectid
}: any) => {
  const clbs: any = await Collabs.aggregate([
    {
      $match: { _id: ObjectId(collabid) }
    },
    {
      $lookup: {
        from: 'guilds',
        localField: 'requestBy.projectName',
        foreignField: 'id',
        as: 'rqserver'
      }
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        collabType: 1,
        format: 1,
        openedSpots: 1,
        description: 1,
        requestBy: 1,
        enddate: 1,
        status: 1,
        expiretime: 1,
        expiretimemin: 1,
        rqserver: {
          id: 1,
          name: 1,
          icon: 1
        }
      }
    }
  ]);
  const projectitem = await Guilds.findOne({ id: projectid });
  const collab = clbs[0];
  const projectname = projectitem ? projectitem.name : '';
  const winners = collab.openedSpots;
  const time = collab.enddate;
  const row: any = new ActionRowBuilder().addComponents([
    new ButtonBuilder()
      .setCustomId(`${collabid}:picker:${projectid}`)
      .setLabel(` ${index}`)
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🎉')
      .setDisabled(pickerbtn),
    new ButtonBuilder()
      .setCustomId(`${collabid}:partici`)
      .setLabel('Participants')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('👤')
  ]);
  const init = new Date(time);
  const { expiretime, expiretimemin } = ConverToTime(
    (init.valueOf() - new Date().valueOf()) / 1000 / 60
  );
  if (expiretime < 0) {
    ended = true
  }
  const endtime = init.toLocaleDateString() + ' ' + init.toLocaleTimeString();
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('WL Raffle')
    .setDescription(
      ended
        ? 'Winners: ' + winnersstr + '\n ' + endtime
        : 'Click 🎉 to enter \n Winners:' +
            winners +
            '\n Ends: `in ' +
            expiretime +
            'hours ' +
            expiretimemin +
            'mins `(Timer) \n ' +
            endtime
    );

  const content =
    '@everyone \n \n Description: ' +
    collab.description +
    '\n Project Name: ' +
    projectname +
    '\n Winners: ' +
    collab.openedSpots +
    '\n \n';

  return {
    content: content,
    ephemeral: true,
    embeds: [embed],
    components: [row]
  };
};

export const showGotopgaeModal = async (interaction: any, collabid: any) => {
  const modal = new ModalBuilder()
    .setCustomId(`${collabid}:gotopagemodal`)
    .setTitle('Go To Page');
  const PagenumberInput = new TextInputBuilder()
    .setCustomId(`pagenumberinput`)
    .setLabel('PAGE NUMNBER')
    .setRequired(true)
    .setPlaceholder('Enter a page number')
    .setStyle(TextInputStyle.Short);
  const pagenumberActionRow = new ActionRowBuilder().addComponents(
    PagenumberInput
  );
  const rows: any = [pagenumberActionRow];
  modal.addComponents(rows);
  await interaction.showModal(modal);
};

export const getRandomInt = (min: any, max: any) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getWinners = async ({ collabid, winners }: any) => {
  let wins: any = [];
  const totalcount = await Customer.countDocuments({
    collabId: ObjectId(collabid)
  });
  console.log(totalcount,"--totalcount--")
  if (totalcount <= winners) {
    wins = await Customer.find({ collabId: ObjectId(collabid) });
  } else {
    let winnersindex: any = [];
    while (winnersindex.length != winners) {
      const randomindex = getRandomInt(0, totalcount - 1);
      if (!winnersindex.find((obj: any) => obj == randomindex)) {
        winnersindex.push(randomindex);
      }
    }
    for (let i in winnersindex) {
      const item = await Customer.findOne({
        collabId: ObjectId(collabid)
      }).skip(winnersindex[i]);
      if (item) {
        wins.push(item);
      }
    }
  }
  let winstr = '';
  for (let i in wins) {
    winstr += ' <@' + wins[i].userId + '>, ';
  }
  return { winnersstr: winstr.slice(0, winstr.length - 2), winners: wins };
};

export const setWinners = async ({ serverId, winners }: any) => {
  console.log(serverId,"--serverId---")
  console.log(winners,"--winners---")
  for (let i in winners) {
    let row = {
      userId: winners[i].userId,
      serverId
    };
    await Winners.findOneAndUpdate(row, row, { upsert: true, new: true });
  }
  return;
};

export const assignRolebyuserid = async ({ serverId, userId, mber }: any) => {
  console.log(serverId, userId,"serverId, userId");
  let winer = await Winners.findOne({ serverId, userId });
  if (winer) {
    console.log(winer,"--winer--")
    let pitem = await Projects.findOne({ serverId });
    if (pitem) {
      console.log(pitem,"--pitem----")
      await mber.roles.add(pitem.roleId);
    }
  }
};

export const assignRolesbyids = async ({ serverId, roleId, winners }: any) => {
  let guild = client.guilds.cache.get(serverId);
  // const roles = guild.roles.cache.get(roleId);
  let res = await guild.members.fetch();
  res.forEach(async (member) => {
    const mber = member as GuildMember;
    if (winners.find((obj: any) => obj.userId == mber.user.id)) {
      console.log(mber.user)
      // try {
        // console.log(roles.id,"--roles.id--")
        await mber.roles.add(roleId);
      // } catch (error) {}
    }
  });
};

export const getBot = () => {
  return client;
};

export const FetchEndcollab = async () => {
  const endcollabs: any = await Collabs.find({
    enddate: {
      $lte: new Date()
    },
    completed: false,
    posted: true
  }).populate('projectId', 'channelId serverId roleId');
  for (let i in endcollabs) {
    const item = endcollabs[i];
    const collabid = item._id;
    let channelId = '';
    let roleId: any = '';

    const pjitem: any = await Projects.findOne({
      serverId: item.requestBy.projectName
    });
    console.log(pjitem,"--pjitem--")
    console.log(item,"--item--")

    let projectid = '';
    let serverId = '';
    if (item.collabType == 1) {
      projectid = item.requestBy.projectName;
      channelId = item.projectId.channelId;
      roleId = item.projectId.roleId;
      serverId = item.projectId.serverId
    } else {
      serverId = pjitem.serverId
      roleId = pjitem.roleId;
      projectid = item.projectId.serverId;
      channelId = pjitem.channelId;
    }
    const pickers = await getPicker(collabid);
    const { winnersstr, winners } = await getWinners({
      collabid,
      winners: item.openedSpots
    });
    console.log(winnersstr,"--winnersstr--")
    if (winnersstr) {
      const wdata = await setWhitelist({
        collabid,
        index: pickers,
        ended: true,
        winnersstr,
        pickerbtn: true,
        projectid: projectid
      });
      console.log(channelId,"--channelId---")
      const channel = client.channels.cache.get(channelId) as TextChannel;
      if (channel) {
        if (item.messageId) {
          channel.messages.fetch(item.messageId).then((msg) => msg.edit(wdata));
        }
        console.log(roleId,"--roleId-----------------")
        if (roleId && roleId.length) {
          setWinners({ serverId: serverId, winners, collabid });
          assignRolesbyids({ winners, serverId: serverId, roleId });
        }
      }
      await Collabs.findByIdAndUpdate(collabid, {completed: true})
    }
  }

  // await Collabs.updateMany(
  //   {
  //     enddate: {
  //       $lte: new Date()
  //     },
  //     completed: false
  //   },
  //   { completed: true }
  // );
};

export const FetchCountDownCollab = async () => {
  const endcollabs: any = await Collabs.find({
    completed: false,
    posted: true
  }).populate('projectId', 'channelId serverId roleId');

  for (let i in endcollabs) {
    const item = endcollabs[i];
    const collabid = item._id;
    let channelId = '';

    const pjitem: any = await Projects.findOne({
      serverId: item.requestBy.projectName
    });

    let projectid = '';
    if (item.collabType == 1) {
      projectid = item.requestBy.projectName;
      channelId = item.projectId.channelId;
    } else {
      projectid = item.projectId.serverId;
      channelId = pjitem.channelId;
    }
    const pickers = await getPicker(collabid);
    const wdata = await setWhitelist({
      collabid,
      index: pickers,
      ended: false,
      pickerbtn: false,
      projectid: projectid
    });
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (channel) {
      if (item.messageId) {
        channel.messages.fetch(item.messageId).then((msg) => msg.edit(wdata));
      }
    }
  }
};

export const FetchInprogresscollab = async () => {
  await Collabs.updateMany(
    {
      inprogressdate: {
        $lte: new Date()
      },
      inprogress: true
    },
    { inprogress: false }
  );
};
