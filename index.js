// https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises

// import inquirer from 'inquirer'
import { input } from '@inquirer/prompts'

// Clear the screen
process.stdout.write('\u001b[2J\u001b[0;0H')

// https://github.com/SBoudrias/Inquirer.js#canceling-prompt
const controller = new AbortController()

// Exit the inquirer prompt
function exit() {
  controller.abort()
}

// close inquirer input if user press "escape" key
process.stdin.on('keypress', (_, key) => {
  if (key.name === 'escape') {
    exit()
  }
})

console.log('Tape exit pour quitter')

const user_input = () => {
  return input({ message: 'User : ' }, { signal: controller.signal })
}

// infinite run https://stackoverflow.com/questions/61417816/how-do-i-invoke-inquirer-js-menu-in-a-loop-using-promises
const main = async () => {
  let loop = true
  while (loop) {
    // await showMenu()
    await user_input().then((answer) => {
      console.log(answer)
      if (answer == 'exit') {
        console.log('save & exit')
        loop = false
        // process.exit(0)
      } else {
        console.log('continue')
      }
    })
  }
}

main()
