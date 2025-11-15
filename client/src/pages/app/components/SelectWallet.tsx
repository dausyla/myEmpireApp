// src/pages/PortfolioListPage.tsx
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";
import { NoWallet } from "./NoWallet";
import { useWallet } from "../../../contexts/WalletContext/WalletContextHook";

export const SelectWallet = () => {
  const { getWallet, walletList } = useWallet();

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center fw-bold">My Portfolios</h1>

      {walletList === null ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {walletList.map((p) => (
              <Col key={p.id}>
                <Card
                  className="h-100 shadow-sm hover-shadow transition"
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onClick={() => getWallet(p.id)}
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-primary">{p.title}</Card.Title>
                    {p.description ? (
                      <Card.Text className="text-muted flex-grow-1">
                        {p.description}
                      </Card.Text>
                    ) : (
                      <Card.Text className="text-muted fst-italic">
                        No description
                      </Card.Text>
                    )}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mt-3 align-self-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        getWallet(p.id);
                      }}
                    >
                      Open
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {walletList.length === 0 && (
            <Alert variant="info" className="text-center mt-5">
              <p className="mb-2">No portfolios yet.</p>
              <NoWallet />
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};
