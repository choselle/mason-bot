from decouple import config
import discord

client = discord.Client()
voice = None
isConnected = False
TOKEN = config('TOKEN')
TARGETUSERTOANNOY = int(config('TARGETUSERTOANNOY'))

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))

@client.event
async def on_voice_state_update(member, oldState, newState):
    oldVoice = oldState.channel
    newVoice = newState.channel

    if oldVoice is not newVoice:
        if oldVoice is None:
            print('{0.name} has joined channel'.format(member))
            if member.id == TARGETUSERTOANNOY:
                await followMason(newVoice)
        elif newVoice is None:
            print('{0.name} left Discord'.format(member))
            if member.id == TARGETUSERTOANNOY:
                await leaveMason(oldVoice)
        else:
            print('{0.name} switched from chanel {1} to {2}'.format(member, oldVoice, newVoice))
            if member.id == TARGETUSERTOANNOY:
                await followMason(newVoice)

async def followMason(channel):
    global isConnected
    global voice
    if not channel:
        print('The channel does not exist!')
    else:
        if not isConnected:
            voice = await channel.connect()
            playSong(channel)
            isConnected = True
        else:
            await voice.move_to(channel)
            return

async def leaveMason(channel):
    global isConnected
    if not channel:
        print('The channel does not exist!')
    await voice.disconnect()
    isConnected = False

def playSong(connection):
    print('playSong fired.')

client.run(TOKEN)