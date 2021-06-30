import discord

client = discord.Client()

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('$hello'):
        await message.channel.send('Hello!')

@client.event
async def on_voice_state_update(member, oldState, newState):
    oldVoice = oldState.channel
    newVoice = newState.channel
    userName = member

    if (oldVoice is not newVoice):
        if (oldVoice is None):
            print('has joined channel')
        elif (newVoice is None):
            print('left Discord')
        else:
            print('switched from chanel')

client.run('Token goes here...')