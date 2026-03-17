---
title: SCUCTF2025 WriteUp For Crypto
published: 2025-12-22
description: 四川大学网络安全新生赛题解
image: ./covers/cover1.webp
tags: [网络安全, 密码学]
category: 网络安全
draft: false
---


## 题目解题过程

### Crypto-Cipher_World 解题步骤：

分析给出的```source.py```文件

这是一个简单的凯撒密码的变种，位移量随着字符的位置变化，且大小写处理有特定的模运算规则，数字不变

解密时 ```val = (ord(ch) - 'A' - i) % 26```

##### 解题脚本：

```
def decrypt():
    ciphertext = 'LSIP{90O3016XY507ZAC594393LI4O5111Q9S}'
    flag = ''
    for i, ch in enumerate(ciphertext):
        if not ch.isalpha():
            flag += ch
            continue
        val = (ord(ch) - 0x41 - i) % 26
        if 6 <= val <= 25:
            flag += chr(val + 91)
        else:
            flag += chr(val + 117)
    print(f"Flag: {flag}")

if __name__ == '__main__':
    decrypt()
```

运行结果  ```Flag: flag{90b3016ff507ccd594393fb4f5111c9c}```



### Crypto-简单RSA 解题步骤

ezRSA 不解释了

##### 解题脚本：

```
from Crypto.Util.number import long_to_bytes

e = 3
p = 11970437609424596149536516744044280453332961535134364392954434221723172001603547461858859616240819109871284915934211118452427511186758259263490529797183361
q = 10454691614319199509984285452491816961189450584838035893749531757606836106186876289209494643976610977546104812311094237581643733495040164470836760560610627
c = 2217344750801189524274672246862938085230661153285289146344769088886101104266265675532720897651469165487936001729716998210925650514547201125501752361367850192853855048192077103944658191705037250271099453495255941354758075102252955975698663958089720904359276147538714118305125

n = p * q
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)
m = pow(c, d, n)

flag = long_to_bytes(m)
print(flag.decode())
```

运行结果：  ``` flag{c1f6e9cf71a42f9e99be3f851d0d6088}```



### Crypto-简单RSA1 解题步骤

典型的 RSA 广播攻击 

利用中国剩余定理，解出一个数C，对其开九次方根转为字符串可得

##### 解题脚本：

```
import functools
e = 9
c_list = [
    60422774210368167327558627099503223974670502084592298403112716646213334530032773234608142517191740444601035032070461194506178138724801135668866092433881204619871489146045843805774665744056126898766806350409856875224095143355701779695366417022344634716616249876844097454374970404837382227345659132820123173090,
    1548515472542316970009797910524227526630156194940307567149710794848104029396305230930111704481262581322839492286657653840938695169639711592483638773207490216874541714729392096593203790489682575969667095637968950192880807561674072457193648727737045484738557043064266187864083049444694178191841664061548682683,
    63997269544043702340964896221661508722956887514279460624642813755652774883143550345386812788592519505671422832361174285914433909536227429706004712896397700388850196115606657589639207044923816067418993158614375848914930487298899738427807035731730548407132064049495948921908065995853280533716005062034745711124,
    104830260954270440141508756392562106621435137055016416078870669348823346707880271508087681647839991301064773171215622891078684827246896078527036199521374752596232033482487255612526276285371686577467356527917016025635514476084437378881338787118318802879655229449178722759877198041555207502237145282063176764305,
    71669917331764722389157935763877578382985127342955191183183692459861565299036170505447883908062184543911705463919031165806756457533030572649589981282789495117729671527243521681495074641961010071972272597379972539562020760943540081270589375385614591155379778736486090959007417250045146479157295997429112978997,
    23773925910774699270810426463564022549424863330447040742239562595391864704312326001621709687376662658134425995416608051972054472083265848514185213232814172499350439655140786642288191937078117177731879868077201383311710568859559981812401123508790477105093578893618483910705071231331130366213882626533985482222,
    42776588367917717675885058628724816119700229198486990585115596821940448842946552981487116918437502457989573136786095120564571857078694105020100617511360733783082851727533230712128301162593007827182123732458079937856074308824552940568298500753989933627593849759407222527616626156605806175185195913388890191545,
    54820443622797797186192761450715649064921880356969423747101414510307901790878759069668816270269496462696882985332594161667137012315255719522029658357094696269444322821426023746210435484154436686082542365841404940801549584343200856781798748454236804338471955873845738807870277756362625112088919202584613815740,
    60178854503899966556171158804048653831385155840953199884942738389508007987866572251220367652857368821428399443097581281918516404295980084380147677181255226527487538713322419099365319266934781017251843916925817987501769624108408790645509480850225200315997383962492544168651407394451724125751330326334636707580
]
N_list = [
    88841820276163724263438846296068200320485097354749847010976879067550071438994684776528402355714809553031713190050749873292944726903048853887859066061952867282417916541952630388795078475960898412923434669886923999144331042639200168594173630372477755390371662439076269735063240694415445021186889825816016117453,
    93953758051319253359579731704060639536267853267711049880442341366771230912165467487090178573110137038295708528434195805452005607923955581728793960178214596438703215521559446077067409243755580630361568875148731728012780161208369254662360999761752744734585832201063267092704877183176175189893157990697534410409,
    127352185375550372587448469026585048828446233519928164720532530645631707081355644666645434032032186445842680270384096738633676399371498011092700153321606429373068682501223567216265274224689751526798408937238251686669014231339968745956954050528831895323165487624218746651080296896286708600518255581494292117301,
    154448413516358892969248743140276640339606562736911501703655437715441333981350609741709978963153922708040922138014711618164682927812024456777084918811264347224716673620482594783702272353729239203132823079184635827934187699248544816907634482998356370330216618544340068635964425787151804295946486323677569277043,
    72237222277258949182585898123485137101708510712454289820633948056766008260117895206692893184664490470095152924160991112164786451897453627887305864637835829779016480376648904826622280345630123463579156284803015258813482975400452520787683381656522052691879289749812756833196769338881404071920995888552725837021,
    106978652002111246156063737109565478485922532124287475172565398755013000859883653857649201625275367574593525939198448178131883763819899126671812583410317698227630021228461030849813578540353643433051719181778207950345107852587856091546460039372117533815633860683972467268679873164522336301766334669813569892009,
    110963945212745197187480222996599866552015314274716440154897515058638889531177455039059203994000119337812866505660376610888035043780529182516475252816022071401156430541841305266731777858019368903210378212726389353434384586451892173596633310342985236413470250744473363216319627266939655992734266474193261586763,
    124625219042421896961932138641725151211805761652851987702606252482209225797773654819889669843921475587441962761805781037861257589009645810296406412428009946637545233313203781628386498465407937674615254385579626824582054064668000256523863084598457655759530137778050037794507617069386987192786026689925121304461,
    102654059769982892436994624032423399483028839711488642282195204637151212212197096740210156430444671562825376364550907009300610959578821401146824412736690246407882335281256332929901166198471015948454896195497907986039266862402406607821108902857334359403847441547281832143252567554884117234781542951019266606663
]
def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)
def modinv(a, m):
    g, x, y = egcd(a, m)
    return x % m
def crt(a, n):
    prod = functools.reduce(lambda x, y: x * y, n)
    sum_val = 0
    for n_i, a_i in zip(n, a):
        p = prod // n_i
        sum_val += a_i * modinv(p, n_i) * p
    return sum_val % prod
def find(x, n):
    high = 1
    while high ** n < x:
        high *= 2
    low = high // 2
    while low < high:
        mid = (low + high) // 2
        if low < mid and mid**n < x:
            low = mid
        elif high > mid and mid**n > x:
            high = mid
        else:
            return mid
    return mid + 1
if __name__ == '__main__':
    M_e = crt(c_list, N_list)
    m_int = find(M_e, e)
    num_bytes = (m_int.bit_length() + 7) // 8
    m_bytes = m_int.to_bytes(num_bytes, byteorder='big')
    print(f"{m_bytes}")
```

运行结果： ```b'flag{650ca162adc4a2f51e1b9af942df29f1}'```



### Crypto-山人八卦袖内藏 解题步骤

八卦来表示二进制数值

正反+两个卦象的值得出二进制整数，对应的ASCII码字母组合得到flag

- 正艮巽  => ```1``` ```100``` ```110```  => ```1100110``` => f

  以此类推，得到flag为``` flag{90b3016ff507ccd594393fb4f5111c9c}```



### Crypto-01248 解题步骤

Crypto中最水也是最恶心的题目

01248密码秒了，得出FLAG{YUNYING}

试了很多遍最后发现flag为 ``` flag{YunYing}``` 

这不是纯纯恶心人吗。。。

### Crypto-什么栏目 解题步骤

看到栏目，一眼栅栏密码，解密得到flag
在```https://ctf.bugku.com/tool/railfence```上枚举解密
![](image-12.png)
轻松得到flag：```flag{bf49f41f492b4d578ecda3a9afb0f54c}```

### Crypto-小小维纳，可笑可笑 解题步骤

给出的 n和e都非常大（约 1024 位），且e和n的数量级相同。
根据提示，选择维纳攻击
```python
import math

def continued_fractions(n, d):
    while d:
        q = n // d
        yield q
        n, d = d, n % d

def convergents(cf):
    n0, n1 = 0, 1
    d0, d1 = 1, 0
    for q in cf:
        n_next = q * n1 + n0
        d_next = q * d1 + d0
        yield n_next, d_next
        n0, n1 = n1, n_next
        d0, d1 = d1, d_next

def solve_quadratic_int(a, b, c):
    # Roots of ax^2 + bx + c = 0
    # Delta = b^2 - 4ac
    delta = b*b - 4*a*c
    if delta < 0: return None
    
    # Integer square root
    isqrt_delta = math.isqrt(delta)
    
    if isqrt_delta * isqrt_delta != delta:
        return None
        
    # Roots
    x1 = (-b + isqrt_delta) // (2*a)
    x2 = (-b - isqrt_delta) // (2*a)
    return x1, x2

n = 53935752499632394237566118604359892718551599347103770165725315381682199061231305149871806005165260280090479975164442744084144966392328763556404239396226819470535452063874887678501380410846947366731878954649755863213861355954458952288934844717604661623462592208245116654049598341395547558917480988549480710053
e = 24089812727939473377106986839231213000027354412422404767919546765423920656889461253619150192713429210805965327870135779746565500272194239190912741430085434073206746835643285459484069375458331543164741898206782337319633955007342267096062328568437378488906707151581554299081980005056634810284685406654001592981
c = 11841667115298930394046403591110886728843116188296120349135149714823163139880036389113944364018136771206785113712667463402504792394799117772574425782666242546383751254294439949528419287518978093348377437226381021286296812291097137179772817826065372736601838186625888784853135191493875564754914102135431686285

cf = continued_fractions(e, n)
conv = convergents(cf)

found_d = None
for k, d in conv:
    if k == 0: continue
    
    if (e * d - 1) % k == 0:
        phi = (e * d - 1) // k
        
        # Check roots
        # equation: x^2 - (n - phi + 1)x + n = 0
        b_val = -(n - phi + 1)
        roots = solve_quadratic_int(1, b_val, n)
        if roots:
            found_d = d
            break

if found_d:
    m = pow(c, found_d, n)
    try:
        print(m.to_bytes((m.bit_length() + 7) // 8, 'big'))
    except:
        print(m)
else:
    print("Failed")
```
解出flag：```flag{a11b0b9c19ed439eaf7144c8d6211eba}```

### Crypto-Symmetrical Encryption 解题步骤
编写代码
```python
from hashlib import md5
from itertools import product

SBOX = [
    [0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76],
    [0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0],
    [0xB7, 0xFD, 0x93, 0x26, 0x36, 0x3F, 0xF7, 0xCC, 0x34, 0xA5, 0xE5, 0xF1, 0x71, 0xD8, 0x31, 0x15],
    [0x04, 0xC7, 0x23, 0xC3, 0x18, 0x96, 0x05, 0x9A, 0x07, 0x12, 0x80, 0xE2, 0xEB, 0x27, 0xB2, 0x75],
    [0x09, 0x83, 0x2C, 0x1A, 0x1B, 0x6E, 0x5A, 0xA0, 0x52, 0x3B, 0xD6, 0xB3, 0x29, 0xE3, 0x2F, 0x84],
    [0x53, 0xD1, 0x00, 0xED, 0x20, 0xFC, 0xB1, 0x5B, 0x6A, 0xCB, 0xBE, 0x39, 0x4A, 0x4C, 0x58, 0xCF],
    [0xD0, 0xEF, 0xAA, 0xFB, 0x43, 0x4D, 0x33, 0x85, 0x45, 0xF9, 0x02, 0x7F, 0x50, 0x3C, 0x9F, 0xA8],
    [0x51, 0xA3, 0x40, 0x8F, 0x92, 0x9D, 0x38, 0xF5, 0xBC, 0xB6, 0xDA, 0x21, 0x10, 0xFF, 0xF3, 0xD2],
    [0xCD, 0x0C, 0x13, 0xEC, 0x5F, 0x97, 0x44, 0x17, 0xC4, 0xA7, 0x7E, 0x3D, 0x64, 0x5D, 0x19, 0x73],
    [0x60, 0x81, 0x4F, 0xDC, 0x22, 0x2A, 0x90, 0x88, 0x46, 0xEE, 0xB8, 0x14, 0xDE, 0x5E, 0x0B, 0xDB],
    [0xE0, 0x32, 0x3A, 0x0A, 0x49, 0x06, 0x24, 0x5C, 0xC2, 0xD3, 0xAC, 0x62, 0x91, 0x95, 0xE4, 0x79],
    [0xE7, 0xC8, 0x37, 0x6D, 0x8D, 0xD5, 0x4E, 0xA9, 0x6C, 0x56, 0xF4, 0xEA, 0x65, 0x7A, 0xAE, 0x08],
    [0xBA, 0x78, 0x25, 0x2E, 0x1C, 0xA6, 0xB4, 0xC6, 0xE8, 0xDD, 0x74, 0x1F, 0x4B, 0xBD, 0x8B, 0x8A],
    [0x70, 0x3E, 0xB5, 0x66, 0x48, 0x03, 0xF6, 0x0E, 0x61, 0x35, 0x57, 0xB9, 0x86, 0xC1, 0x1D, 0x9E],
    [0xE1, 0xF8, 0x98, 0x11, 0x69, 0xD9, 0x8E, 0x94, 0x9B, 0x1E, 0x87, 0xE9, 0xCE, 0x55, 0x28, 0xDF],
    [0x8C, 0xA1, 0x89, 0x0D, 0xBF, 0xE6, 0x42, 0x68, 0x41, 0x99, 0x2D, 0x0F, 0xB0, 0x54, 0xBB, 0x16]
    ]

SBOX_inv = [
    [0x52, 0x09, 0x6A, 0xD5, 0x30, 0x36, 0xA5, 0x38, 0xBF, 0x40, 0xA3, 0x9E, 0x81, 0xF3, 0xD7, 0xFB],
    [0x7C, 0xE3, 0x39, 0x82, 0x9B, 0x2F, 0xFF, 0x87, 0x34, 0x8E, 0x43, 0x44, 0xC4, 0xDE, 0xE9, 0xCB],
    [0x54, 0x7B, 0x94, 0x32, 0xA6, 0xC2, 0x23, 0x3D, 0xEE, 0x4C, 0x95, 0x0B, 0x42, 0xFA, 0xC3, 0x4E],
    [0x08, 0x2E, 0xA1, 0x66, 0x28, 0xD9, 0x24, 0xB2, 0x76, 0x5B, 0xA2, 0x49, 0x6D, 0x8B, 0xD1, 0x25],
    [0x72, 0xF8, 0xF6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xD4, 0xA4, 0x5C, 0xCC, 0x5D, 0x65, 0xB6, 0x92],
    [0x6C, 0x70, 0x48, 0x50, 0xFD, 0xED, 0xB9, 0xDA, 0x5E, 0x15, 0x46, 0x57, 0xA7, 0x8D, 0x9D, 0x84],
    [0x90, 0xD8, 0xAB, 0x00, 0x8C, 0xBC, 0xD3, 0x0A, 0xF7, 0xE4, 0x58, 0x05, 0xB8, 0xB3, 0x45, 0x06],
    [0xD0, 0x2C, 0x1E, 0x8F, 0xCA, 0x3F, 0x0F, 0x02, 0xC1, 0xAF, 0xBD, 0x03, 0x01, 0x13, 0x8A, 0x6B],
    [0x3A, 0x91, 0x11, 0x41, 0x4F, 0x67, 0xDC, 0xEA, 0x97, 0xF2, 0xCF, 0xCE, 0xF0, 0xB4, 0xE6, 0x73],
    [0x96, 0xAC, 0x74, 0x22, 0xE7, 0xAD, 0x35, 0x85, 0xE2, 0xF9, 0x37, 0xE8, 0x1C, 0x75, 0xDF, 0x6E],
    [0x47, 0xF1, 0x1A, 0x71, 0x1D, 0x29, 0xC5, 0x89, 0x6F, 0xB7, 0x62, 0x0E, 0xAA, 0x18, 0xBE, 0x1B],
    [0xFC, 0x56, 0x3E, 0x4B, 0xC6, 0xD2, 0x79, 0x20, 0x9A, 0xDB, 0xC0, 0xFE, 0x78, 0xCD, 0x5A, 0xF4],
    [0x1F, 0xDD, 0xA8, 0x33, 0x88, 0x07, 0xC7, 0x31, 0xB1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xEC, 0x5F],
    [0x60, 0x51, 0x7F, 0xA9, 0x19, 0xB5, 0x4A, 0x0D, 0x2D, 0xE5, 0x7A, 0x9F, 0x93, 0xC9, 0x9C, 0xEF],
    [0xA0, 0xE0, 0x3B, 0x4D, 0xAE, 0x2A, 0xF5, 0xB0, 0xC8, 0xEB, 0xBB, 0x3C, 0x83, 0x53, 0x99, 0x61],
    [0x17, 0x2B, 0x04, 0x7E, 0xBA, 0x77, 0xD6, 0x26, 0xE1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0C, 0x7D]
    ]

Rcon = [0x01000000, 0x02000000, 0x04000000, 0x08000000, 0x10000000, 0x20000000, 0x40000000, 0x80000000, 0x1B000000, 0x36000000]

def SubBytes(State):
    for i in range(len(State)):
        row = State[i] >> 4
        col = State[i] & 0xF
        State[i] = SBOX[row][col]
    return State

def SubByte_inverse(State):
    for i in range(len(State)):
        row = State[i] >> 4
        col = State[i] & 0xF
        State[i] = SBOX_inv[row][col]
    return State

def ShiftRow(S):
    return [S[0],S[5],S[10],S[15],
            S[4],S[9],S[14],S[3],
            S[8],S[13],S[2],S[7],
            S[12],S[1],S[6],S[11]]

def ShiftRow_inverse(S):
    return [S[0],S[13],S[10],S[7],
            S[4],S[1],S[14],S[11],
            S[8],S[5],S[2],S[15],
            S[12],S[9],S[6],S[3]]

def GFmul(poly1,poly2):
    result = 0
    for index in range(poly2.bit_length()):
        if poly2 & 1 << index:
            result ^= (poly1 << index)
    return result

def mod(poly):
    MOD = 0b100011011
    while poly.bit_length() > 8:
        poly ^= MOD << (poly.bit_length() - 9)
    return poly

def MixColumns(State):
    T = [[0x2, 0x3, 0x1, 0x1], 
        [0x1, 0x2, 0x3, 0x1], 
        [0x1, 0x1, 0x2, 0x3], 
        [0x3, 0x1, 0x1, 0x2]]
    
    M = [0 for _ in range(16)]
    for row in range(4):
        for col in range(4):
            for Round in range(4):
                M[row + col*4] ^= GFmul(T[row][Round],State[Round + col*4])
            M[row + col*4] = mod(M[row + col*4])
    return M

def MixColumns_inverse(State):
    T = [[0xe, 0xb, 0xd, 0x9],
        [0x9, 0xe, 0xb, 0xd], 
        [0xd, 0x9, 0xe, 0xb], 
        [0xb, 0xd, 0x9, 0xe]]
    
    M = [0 for _ in range(16)]
    for row in range(4):
        for col in range(4):
            for Round in range(4):
                M[row + col*4] ^= GFmul(T[row][Round],State[Round + col*4])
            M[row + col*4] = mod(M[row + col*4])
    return M

def RotWord(_4byte_block):
    res = ((_4byte_block & 0xFFFFFF) << 8) + (_4byte_block >> 24)
    return res

def SubWord(_4byte_block):
    res = 0
    for position in range(4):
        i = _4byte_block >> position * 8 + 4 & 0xF
        j = _4byte_block >> position * 8 & 0xF
        res ^= SBOX[i][j] << position * 8
    return res
 
def generateKey(key:bytes):
    key = int.from_bytes(key)
    w = [key >> 96,                    
        key >> 64 & 0xFFFFFFFF,        
        key >> 32 & 0xFFFFFFFF,        
        key & 0xFFFFFFFF]              
    w = w + [0] * 40
    for i in range(4,44):
        tmp = w[i-1]
        if i % 4 == 0:
            tmp = SubWord(RotWord(tmp)) ^ Rcon[i // 4 - 1]
        w[i] = w[i-4] ^ tmp
    newkey = [sum([w[4*i]<<96,w[4*i+1]<<64,w[4*i+2]<<32,w[4*i+3]]).to_bytes(16,byteorder = 'big') for i in range(11)]
    return newkey
    
def _16bytes_xor(_16bytes_1,_16bytes_2):
    len1 = len(_16bytes_1)
    if len1 != 16:
        _16bytes_1 = b"\x00"*(16 - len1) + _16bytes_1
    len2 = len(_16bytes_2)
    if len2 != 16:
        _16bytes_2 = b"\x00"*(16 - len2) + _16bytes_2
    return [_16bytes_1[i] ^ _16bytes_2[i] for i in range(16)]

def AddRoundKey(State,Roundkeys,index):
    return _16bytes_xor(State,Roundkeys[index])

def EncryptBlock(block: bytes, key: bytes):
    State = list(block)
    Roundkeys = generateKey(key)
    State = AddRoundKey(State,Roundkeys,0)                  
    for round in range(1,10):
        State = SubBytes(State)                             
        State = ShiftRow(State)                             
        State = MixColumns(State)                           
        State = AddRoundKey(State,Roundkeys,round)          
    State = SubBytes(State)
    State = ShiftRow(State)
    State = AddRoundKey(State,Roundkeys,10)
    return bytes(State)

def DecryptBlock(block: bytes, key: bytes):
    State = list(block)
    Roundkeys = generateKey(key)
    State = AddRoundKey(State,Roundkeys,10)
    for round in range(1,10):
        State = ShiftRow_inverse(State)
        State = SubByte_inverse(State)
        State = AddRoundKey(State,Roundkeys,10-round)
        State = MixColumns_inverse(State)
    State = ShiftRow_inverse(State)
    State = SubByte_inverse(State)
    State = AddRoundKey(State,Roundkeys,0)
    return bytes(State)

def unpad(message:bytes):
    pad_len = message[-1]
    if pad_len < 1 or pad_len > 16:
        raise ValueError("Invalid padding")
    if message[-pad_len:] != bytes([pad_len] * pad_len):
        raise ValueError("Invalid padding")
    return message[:-pad_len]

def FullDecrypt(ciphertext, key):
    blocks = [ciphertext[i*16:(i+1)*16] for i in range(len(ciphertext) // 16)]
    plaintext = b""
    for block in blocks:
        plaintext += DecryptBlock(block, key)
    return unpad(plaintext)

unique_ints = sorted(list(set(b"Block_Encrypt")))
plaintext = b"Block_Encryption"
ciphertext = b'\xbd\xbe\xbe\xa6\xd2\x97\xd8\x95P\x08\x9a\xcac\xc0U\x13'
enc_flag = b'H,\xac\xa0\xf2Y2\xb6\xe1d#\x99o`\xfcO@\x06\xf4jm\x15\x84\x0b\xd5s1\xdf\xc1$\x04U<h\xe78\xd5u\x96\xc1\xf4\xe9"X\xd0@\x01\x92'

# 1. Build table: E(P, k1) -> a
forward_map = {}
for p in product(unique_ints, repeat=4):
    a = bytes(p)
    k1 = md5(a).digest()
    mid = EncryptBlock(plaintext, k1)
    forward_map[mid] = a

# 2. Check
found_a = None
found_b = None

for p in product(unique_ints, repeat=4):
    b_cand = bytes(p)
    k2 = md5(b_cand).digest()
    dec_mid = DecryptBlock(ciphertext, k2)
    if dec_mid in forward_map:
        found_a = forward_map[dec_mid]
        found_b = b_cand
        print(f"Found! a={found_a}, b={found_b}")
        break

if found_a and found_b:
    final_key = md5(found_a + found_b).digest()
    try:
        flag = FullDecrypt(enc_flag, final_key)
        print(f"Flag: {flag}")
    except Exception as e:
        print(f"Decryption failed: {e}")
else:
    print("Not found.")
```
解出flag：```flag{Meet_In_The_Middle_Attack_Successfully!}```