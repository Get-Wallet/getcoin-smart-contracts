# Development Environment

Aşağıdaki komut ile blockchain localde çalıştırılır. Komut çalıştığı sürece data kalıcıdır, sonlanınca data da silinir. Kalıcı data ile çalışmak için DB konfigürasyonu yapılabilir.

> npx ganache-cli

Komut her çalıştığında farklı private key'ler üretir. Aynı private key'lerin oluşması için aşağıdaki parametre ile çalıştırılabilir.

> npx ganache-cli --deterministic

Komutun çıktısındaki ilk private key Metamask'a import edilerek kullanılabilir. Metamask'ta "Localhost 8545" network'ünde çalışılmalıdır.

Truffle komutlarında "--network development" parametresi kullanılmalıdır.

# Test Environment

Polygon Mumbai test ağında çalışmak için aşağıdaki komut çalıştırılarak yeni bir private key oluşturulur. Önceden oluşturulmuş bir private key de kullanılabilir.

> npx mnemonic-to-private-key

Komutun çıktısındaki "Mnemonic Phrase" bilgisi ".env.example" dosyası örnek alınarak ".env" dosyasına yazılmalıdır. "Private Key" değeri ise Metamask'a import edilerek kullanılabilir. Metamask'ta "Polygon Mumbai Testnet" network'ünde çalışılmalıdır. Gas ücretleri için Mumbai faucet'ler kullanılabilir.

Truffle komutlarında "--network polygonTestnetMumbai" parametresi kullanılmalıdır.

# Production Environment

Polygon ağında çalışmak için aşağıdaki komut çalıştırılarak yeni bir private key oluşturulur. Önceden oluşturulmuş bir private key de kullanılabilir.

> npx mnemonic-to-private-key

Komutun çıktısındaki "Mnemonic Phrase" bilgisi ".env.example" dosyası örnek alınarak ".env" dosyasına yazılmalıdır. "Private Key" değeri ise Metamask'a import edilerek kullanılabilir. Metamask'ta "Polygon Mainnet" network'ünde çalışılmalıdır.

Truffle komutlarında "--network polygonMainnet" parametresi kullanılmalıdır.

# Deployment

Aşağıdaki komut ile smart contract'lar compile edilir.

> npx truffle compile --all

Compile edilen contract'lar "build" dizinine yerleşir. Bu dizinin repo'da bulunmasına gerek olmadığı için gitignore ile repo'nun dışında tutulmuştur.

Aşağıdaki komut ile compile edilen contract'lar belirlenen network'e deploy edilir. Komut migrations dizinindeki script'leri çalıştırır. Her deploy'da son script'i çalıştırmak için -f ve --to parametrelerine script'in sıra numarası verilir.

> npx truffle migrate --network polygonTestnetMumbai -f 1 --to 1

Komutun çıktısında 2 contract'ın deploy edildiği görülür. İlki Getcoin diğeri ise ERC1967Proxy. Token'ın contract adresi olarak ERC1967Proxy contract'ınınki kullanılması gerekiyor. Sonraki deployment'larda Getcoin contract'ı değişeceği, yeni versiyonu deploy edileceği için onun contract adresi sabit kalmayacaktır. Zaten proxy contract'ı da bundan etkilenmemek için kullanılan bir yöntem.

Deployment ile ilgili meta verileri ".openzeppelin" dizinine json formatında yerleşir. Buradaki "unknown-" prefix'i ile başlayan json dosyaları local deployment'lar ile ilgili olduğu için repo'nun dışında tutulmuştur. Aynı şey test network'ü için de geçerlidir.

Deploy edilen contract'ı Metamask'ta görebilmek için komutun çıktısındaki ERC1967Proxy'nin contract adresi kopyalanır. Metamask'taki "Token'ları İçe Aktar" kısmından contract adresi girilerek import edilir. Contract adresi ilgili input'a girildiğinde symbol ve decimal bilgisi otomatik olarak ağdan gelecektir.

Bu aşamada contract ile etkileşime girmeye hazır durumdayız. Metamask üzerinden token gönderme/alma işlemleri yapılabilir.

Contract'ın admin method'ları ile etkileşime girmek için aşağıdaki komut ile Truffle Console'u kullanabiliriz.

> npx truffle console --network polygonTestnetMumbai

Console'da aşağıdaki şekilde deploy edilen contract'ın bir instance'ı alınarak istenilen method'ları çağırılabilir.

> let contract = await Getcoin.deployed()
> contract.pause()

Örnekte token transfer işlemlerini pause ettik. Metamask üzerinden bir transfer işlemi denendiğinde başarılı olmadığı görülecektir. Transferlerin tekrar devam edebilmesi için "unpause" method'u çağrılmalıdır.

Contract sahibini değiştirmek için transferOwnership method'unu çağırmalıyız. Bu işlemle pause, unpause ve ileride eklenebilecek burn vb. yönetimsel method'ları çağırma yetkisini ve contract'ı upgrade edebilme yetkisini başka bir private key'e devrediyoruz.

> let contract = await Getcoin.deployed()
> contract.transferOwnership('NEW_OWNER_PUBLIC_ADDRESS')

Method çağırıldıktan sonra artık pause gibi bir method'u önceki private key'imizle çağırdığımızda başarılı olmadığını görebiliriz.

Aşağıdaki komut ile console'dan çıkabiliriz.

> .exit

# Upgrade

Contract'ın yeni bir versiyonunu deploy etmek için öncelikle yeni versiyonu "contracts" dizininde GetcoinV2 class name ile oluştururuz. Ardından örneği "migrations" dizininde bulunan upgrade script'ini hazırlarız. Sonrasında contract'ları compile etmek için aşağıdaki komutu çalıştırırız.

> npx truffle compile --all

Yeni versiyonu deploy etmek için aşağıdaki komutu çalıştırırız. Yine son migration script'ini çalıştırmak için -f ve --to parametrelerine script'in sıra numarası verilir.

> npx truffle migrate --network polygonTestnetMumbai -f 2 --to 2

# PolygonScan Verify

Token'ın PolygonScan'da verified olarak görünmesi ve smart contract kodunun erişilebilir olması için aşağıdaki komutu çalıştırmalıyız. Her deploy'da contract değişeceği için bu işlemi her deploy'dan sonra tekrarlamak gerekiyor.

> npx truffle run verify Getcoin --network polygonTestnetMumbai
