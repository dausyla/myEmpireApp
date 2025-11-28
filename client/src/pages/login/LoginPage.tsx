import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext/AuthContextHook";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

export const LoginPage = () => {
  const { login, signup } = useAuthContext();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSigningUp) {
      signup(email, password, username);
    } else {
      login(email, password);
    }
  };

  const handleGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: "var(--brand-gradient)" }}
    >
      <Row className="w-100">
        <Col md={6} lg={5} xl={4} className="mx-auto">
          <Card
            className="shadow-lg border-0 rounded-4 overflow-hidden"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2
                  className="fw-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {isSigningUp ? "Créer un compte" : "Connexion"}
                </h2>
                <p className="text-muted">
                  {isSigningUp
                    ? "Rejoignez MyEmpire"
                    : "Accédez à votre portefeuille"}
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="fw-medium">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="py-2"
                  />
                </Form.Group>

                {isSigningUp && (
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="fw-medium">Pseudo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Choisissez un pseudo"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="py-2"
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="fw-medium">Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="py-2"
                  />
                </Form.Group>

                <div className="d-grid gap-2 mb-3">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="fw-semibold rounded-pill"
                  >
                    {isSigningUp ? "S'inscrire" : "Se connecter"}
                  </Button>

                  <Button
                    variant="outline-dark"
                    size="lg"
                    onClick={handleGoogle}
                    className="d-flex align-items-center justify-content-center gap-2 rounded-pill"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 6.5c1.61 0 3.05.66 4.08 1.73l3.06-3.06C17.46 3.12 14.97 2 12 2 7.7 2 3.99 4.47 2.18 7.07l3.66 2.84C6.71 8.41 9.14 6.5 12 6.5z" />
                    </svg>
                    Continuer avec Google
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setIsSignup(!isSigningUp)}
                    className="text-decoration-none fw-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {isSigningUp
                      ? "Déjà un compte ? Se connecter"
                      : "Pas de compte ? S'inscrire"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="text-center mt-4 text-muted small">
            © 2025 MyEmpire — Tous droits réservés
          </div>
        </Col>
      </Row>
    </Container>
  );
};
