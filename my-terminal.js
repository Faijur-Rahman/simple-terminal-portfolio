const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

$.terminal.xml_formatter.tags.green = () => `[[;#44D544;]`;
$.terminal.xml_formatter.tags.blue = (attrs) => `[[;#55F;;${attrs.class}]`;

const root = '~';
let cwd = root;

const user = 'guest';
const server = 'faijur-portfolio.com';

function prompt() {
    return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

const directories = {
    education: [
        '',
        '<white>Education</white>',
        '* <a href="https://en.wikipedia.org/wiki/Jamal_Mohamed_College">Jamal Mohamed College</a> <yellow>"BSc.Computer Science"</yellow> 2022-2025',
        ''
    ],
    projects: [
        '',
        '<white>Projects</white>',
        [
            [
                'E-commerce Platform [Ongoing]',
                'https://github.com/Faijur-Rahman/E-commerce-Application',
                'An online shopping application allowing users to browse and purchase products. Includes cart, checkout, and product search features.'
            ],
            [
                'Todo List Application',
                'https://github.com/Faijur-Rahman/Todo_App',
                'A task management app with a clean front-end and a robust back-end, featuring exception handling and database integration.'
            ],
            [
                'Console Chat Application',
                'https://github.com/Faijur-Rahman/Chat-Application',
                'A terminal-based chat system using sockets and multithreading. Supports multiple client connections to a central server.'
            ],
            [
                'Bank Management System',
                'https://github.com/Faijur-Rahman/Bank-Management-System',
                'Developed with Java Swing and MySQL. Features include account creation, deposits, withdrawals, PIN changes, and viewing statements.'
            ]
        ].map(([name, url, description]) => {
            return `* <a href="${url}">${name}</a> — <white>${description}</white>`;
        }).flat(),
        ''
    ].flat(),
    skills: [
        '',
        '<white>languages</white>',
        ['Java', 'Python', 'SQL', 'Bash'].map(lang => `* <yellow>${lang}</yellow>`),
        '',
        '<white>FrameWork & libraries</white>',
        ['Spring Boot', 'Spring JPA', 'JDBC'].map(lib => `* <green>${lib}</green>`),
        '',
        '<white>tools</white>',
        ['git', 'GNU/Linux'].map(lib => `* <blue>${lib}</blue>`),
        ''
    ].flat()
};

const dirs = Object.keys(directories);

function print_home() {
    term.echo(dirs.map(dir => `<blue class="directory">${dir}</blue>`).join('\n'));
}

const commands = {
    help() {
        const current_command_list = Object.keys(commands);
        const formatted_list = current_command_list.map(cmd => `<white class="command">${cmd}</white>`);
        const help_message = formatter.format(formatted_list);
        term.echo(`List of available commands: ${help_message}`);
    },
    echo(...args) {
        if (args.length > 0) term.echo(args.join(' '));
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dir.startsWith('../') && cwd !== root && dirs.includes(dir.substring(3))) {
            cwd = root + '/' + dir.substring(3);
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                print_home();
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const subDirs = path.split('/');
                if (subDirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const targetDir = subDirs[0];
                    if (targetDir in directories) {
                        this.echo(directories[targetDir].join('\n'));
                    } else {
                        this.error('Invalid directory');
                    }
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_home();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
            print_home();
        } else {
            const currentDirKey = cwd.substring(2);
            this.echo(directories[currentDirKey].join('\n'));
        }
    },
    async joke() {
        const url = 'https://v2.jokeapi.dev/joke/Programming';
        const res = await fetch(url);
        const data = await res.json();

        if (data.type === 'twopart') {
            this.animation(async () => {
                await this.echo(`Q: ${data.setup}`, { delay: 50, typing: true });
                await this.echo(`A: ${data.delivery}`, { delay: 50, typing: true });
            });
        } else if (data.type === 'single') {
            this.echo(data.joke, { delay: 50, typing: true });
        }
    },
    credits() {
        return [
            '',
            '<white>Used libraries:</white>',
            '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            '* <a href="https://jokeapi.dev/">Joke API</a>',
            ''
        ].join('\n');
    }
};

const command_list = Object.keys(commands);
const any_command_re = new RegExp(`^\\s*(${command_list.join('|')})`);
const re = new RegExp(`^\\s*(${command_list.join('|')})(\\s?.*)`);

$.terminal.new_formatter([re, function (_, command, args) {
    return `<white>${command}</white><aqua>${args}</aqua>`;
}]);

const mainFont = 'Big Money-sw';
const mobileFont = 'Doom';

figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts' });
figlet.preloadFonts([mainFont, mobileFont], ready);

function render(text) {
    const cols = term.cols();
    let selectedFont = mainFont;
    let textToRender = text;

    const mobileThresholdCols = 60;

    if (cols < mobileThresholdCols) {
        selectedFont = mobileFont;
        if (text.length * (mobileFont === 'Small' ? 0.5 : 1) > cols - 5) {
            textToRender = 'Faijur';
        }
    }

    return figlet.textSync(textToRender, {
        font: selectedFont,
        width: cols,
        whitespaceBreak: true
    });
}

const term = $('.terminal-wrapper').terminal(commands, {
    greetings: false,
    checkArity: false,
    completion(string) {
        const cmd = this.get_command();
        const { name, rest } = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.filter(dir => dir.startsWith(rest.substring(2))).map(dir => `~/${dir}`);
            }
            if (rest.startsWith('../') && cwd != root) {
                return dirs.filter(dir => dir.startsWith(rest.substring(3))).map(dir => `../${dir}`);
            }
            if (cwd === root) {
                return dirs.filter(dir => dir.startsWith(string));
            }
        }
        return Object.keys(commands).filter(cmd => cmd.startsWith(string));
    },
    prompt
});

term.on('click', '.command', function () {
    const command = $(this).text();
    term.exec(command);
});

term.on('click', '.directory', function () {
    const dir = $(this).text();
    term.exec(`cd ~/${dir}`);
});

term.pause();

function ready() {
    term.echo(() => {
        const ascii = render('Faijur Portfolio');
        return `[[;gray;]${ascii}]\n\nWelcome to my Terminal Portfolio\n`;
    }).resume();

    $(window).on('resize', function () {
        if (term.is_ready()) {
            term.clear();
            term.echo(() => {
                const ascii = render('Faijur Portfolio');
                return `[[;gray;]${ascii}]\n\nWelcome to my Terminal Portfolio\n`;
            });
        }
    });
}

term.exec('help', true);
