import { createJWT, verifyJWT, ES256KSigner, hexToBytes, decodeJWT } from 'did-jwt';
import { Resolver } from 'did-resolver'
import { getResolver } from 'web-did-resolver'

// Create a singer by using a private key (hex).
const key = '18e4d830313dc3d2d7dc26d1396c29d7d77727d07ed38fcc0918f34aa07a90d6';
const signer = ES256KSigner(hexToBytes(key))

// Create a signed JWT
const jwt = await createJWT(
    { aud: 'did:web:visionpixel.github.io', name: 'John Doe' },
    { issuer: 'did:web:visionpixel.github.io', signer },
    { alg: 'ES256K' }
)

console.log(`//// JWT:\n${jwt}`)

// Decode the JWT
const decoded = decodeJWT(jwt)
console.log('\n//// JWT Decoded:\n',decoded)

// Verify the JWT by resolving its DID:WEB
const webResolver = getResolver()
const resolver = new Resolver({
    ...webResolver
})

verifyJWT(jwt, {
    resolver,
    audience: 'did:web:visionpixel.github.io'
}).then(({ payload, doc, did, signer, jwt }) => {
    console.log('\n//// Verified:\n', payload)
})