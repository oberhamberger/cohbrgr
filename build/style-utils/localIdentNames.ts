class LocalIdentNames {
    static classNames = new Set();

    static get(context, localIdentName, localName: string, options) {
        console.log(localIdentName);
        console.log(options);
        console.log(localName);
        //this.classNames.add({ localIdentName });
        return localName;
    }
}

export default LocalIdentNames;
