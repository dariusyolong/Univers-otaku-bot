// UNIVERS OTAKU - BOT OFFICIEL 11 GROUPES
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const P = require("pino")

const REGLEMENT = `🔥 RÈGLEMENT DU GROUPE univers Otaku 🦑

Bienvenue à tous ! Pour garder une bonne ambiance, merci de respecter ces quelques règles :

1️⃣ Respect obligatoire
Pas d’insultes, de provocations, de harcèlement ou de manque de respect envers les membres.

2️⃣ Thème du groupe 🎌
Le groupe est principalement consacré aux animes, mangas, manhwa, light novels, jeux vidéo et à la culture japonaise avec l'ajout du jeu concours Miss/Master 

3️⃣ Pas de spam 🚫
Évitez d’envoyer plusieurs messages inutiles à la suite, des publicités ou des liens sans rapport avec le groupe.

4️⃣ Spoilers interdits sans avertissement ⚠️
Avant de révéler un élément important d’un anime ou manga, prévenez clairement : ⚠️ SPOILER.

5️⃣ Pas de contenu choquant ou +18 🔞
Tout contenu sexuel explicite, violent ou inapproprié est interdit.

6️⃣ Débats entre personnages ⚔️
Les débats du type « Goku vs Naruto », « Gojo vs Sukuna », etc. sont autorisés, mais restez respectueux. On débat des personnages, pas des membres.

7️⃣ Pas de discrimination ❌
Aucune discrimination ou attaque envers quelqu’un en raison de son origine, apparence, langue ou autre.

8️⃣ Respect des admins 👑
Les décisions des administrateurs doivent être respectées. En cas de problème, contactez un admin en privé.

9️⃣ Pas de changement abusif
Ne modifiez pas le nom, la photo ou les informations du groupe sans l’autorisation des admins.

🔟 Amusez-vous ! ❤️‍🔥
Partagez vos recommandations, théories, memes, openings, personnages préférés et découvertes. Le but est de créer une vraie communauté d’otaku ! 🍥🔥

1️⃣1️⃣ mentions du groupe ! ❌
Il est strictement interdit de mentionné le groupe avec de statut, de publier des contenus qui ne cadrent pas avec le thème du groupe. Merci de respecter ces consignes pour assurer le bon fonctionnement du groupe.🛑

⚠️ En cas de non-respect répété du règlement : avertissement, restriction et/ou exclusion du groupe.
JE vous remercie !!!`

let groupes = []

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const sock = makeWASocket({ auth: state, logger: P({level: "silent"}), printQRInTerminal: true })
    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('group-participants.update', async (u) => {
        if(u.action === 'add'){
            await sock.sendMessage(u.id, { text: `🦑 Bienvenue @${u.participants[0].split('@')[0]} dans *Univers Otaku* !\n\nTape *!regles* pour le règlement 🔥`, mentions: u.participants })
        }
    })

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if(!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
        const lower = text.toLowerCase()
        const id = msg.key.remoteJid
        if(id.endsWith("@g.us") && !groupes.includes(id)) groupes.push(id)

        if(lower === "!regles" || lower === "!reglement"){
            await sock.sendMessage(id, {text: REGLEMENT})
        }
        if(lower === "!menu"){
            await sock.sendMessage(id, {text: `🦑 *UNIVERS OTAKU BOT* - ${groupes.length}/11 groupes\n\n!regles - règlement\n!menu - menu\n!fermer / !ouvrir\n!fermerall / !ouvrall - pour les 11 groupes\n!annonce ton message - annonce globale`})
        }
        if(lower.startsWith("!annonce ")){
            let annonce = text.slice(9)
            for(let g of groupes){ await sock.sendMessage(g, {text: `📢 *ANNONCE UNIVERS OTAKU* 🦑\n\n${annonce}`})}
            await sock.sendMessage(id, {text: `✅ Envoyé dans ${groupes.length} groupes`})
        }
        if(lower === "!fermerall"){
            for(let g of groupes){ await sock.groupSettingUpdate(g, 'announcement') }
            await sock.sendMessage(id, {text: "🔒 Les 11 groupes sont fermés"})
        }
        if(lower === "!ouvrall"){
            for(let g of groupes){ await sock.groupSettingUpdate(g, 'not_announcement') }
            await sock.sendMessage(id, {text: "🔓 Les 11 groupes sont ouverts"})
        }
    })
}
start()
