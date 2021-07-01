from decouple import config
import discord

client = discord.Client()
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
    user = member

    if oldVoice is not newVoice:
        if oldVoice is None:
            print('{0.name} has joined channel'.format(user))
            if member.id == TARGETUSERTOANNOY:
                await followMason(newVoice)
        elif newVoice is None:
            print('{0.name} left Discord'.format(user))
            if member.id == TARGETUSERTOANNOY:
                leaveMason(oldVoice)
        else:
            print('{0.name} switched from chanel {1} to {2}'.format(user, oldVoice, newVoice))
            if member.id == TARGETUSERTOANNOY:
                await followMason(newVoice)

async def followMason(channel):
    global isConnected
    print('followMason fired.')
    if not channel:
        print('The channel does not exist!')
    else:
        if isConnected == False:
            await channel.connect()
            isConnected = True
        else:
            return

def leaveMason(channel):
    print('leaveMason fired.')

def playSong(connection):
    print('playSong fired.')

client.run(TOKEN)