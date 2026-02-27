/**
 * DecryptCore - 算法封装层
 * 隔离二进制处理细节
 */
export class DecryptCore {
    static async handle(file) {
        const ext = file.name.split('.').pop().toLowerCase();
        const buffer = await file.arrayBuffer();
        
        if (ext === 'ncm') return this.ncm(buffer);
        if (['qmc0', 'qmc3', 'qmcflac', 'mflac', 'mgg'].includes(ext)) return this.qmc(buffer, ext);
        if (ext === 'kgm' |

| ext === 'vpr') return this.kgm(buffer);
        
        throw new Error("Unsupported Format");
    }

    // NCM 特有的 RC4 逻辑
    static ncm(buffer) {
        const view = new DataView(buffer);
        // 跳过 Magic (10字节)
        let offset = 10;
        
        // 1. 密钥解析 (AES)
        const keyLen = view.getUint32(offset, true); offset += 4;
        const keyBox = new Uint8Array(buffer, offset, keyLen).map(b => b ^ 0x64);
        offset += keyLen;
        // 注意：此处实际需 AES 解密 keyBox，逻辑参照 
        const seed = "neteasecloudmusic_derived_seed"; 

        // 2. 音频解密
        const audioOffset = offset + 13; // 示例偏移
        const audioData = new Uint8Array(buffer.slice(audioOffset));
        const sBox = this.genNcmSBox(seed);
        
        for (let i = 0; i < audioData.length; i++) {
            const j = (i + 1) & 0xff;
            const k = (sBox[j] + sBox) & 0xff]) & 0xff;
            audioData[i] ^= sBox[k];
        }
        
        return { data: audioData, type: 'audio/mpeg' };
    }

    static genNcmSBox(seed) {
        let s = new Uint8Array(256).map((_, i) => i);
        let j = 0;
        for (let i = 0; i < 256; i++) {
            j = (j + s[i] + seed.charCodeAt(i % seed.length)) & 0xff;
            [s[i], s[j]] = [s[j], s[i]];
        }
        return s;
    }

    // QMC 异或逻辑
    static qmc(buffer, ext) {
        const data = new Uint8Array(buffer);
        // QMCv1 示例掩码
        const mask =;
        for (let i = 0; i < data.length; i++) {
            data[i] ^= mask[i % mask.length];
        }
        return { data, type: ext.includes('flac')? 'audio/flac' : 'audio/mpeg' };
    }
}
