import readline from 'readline';

export function input(question: string) {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve: (arg0: any) => void) => {
            readlineInterface.question(question, (answer: any) => {
            resolve(answer)
            readlineInterface.close();
        })
    })
}